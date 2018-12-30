from django.contrib.auth.forms import UserCreationForm
import json
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import TemplateView, FormView, CreateView, ListView, UpdateView, DeleteView, DetailView
import praw

# Create your views here.
from django_common.auth_backends import User

# Create your views here.
from main.forms import ImageFormset, ProductForm
from main.models import Product


class HomePageView(TemplateView):
    template_name = 'main/home_page.html'


class MainPageView(ListView):
    model = Product
    paginate_by = 10
    template_name = 'main/main_page.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(object_list=None, **kwargs)
        categories_info = {}
        categories_info['types'] = []
        categories_info['amounts'] = []

        product_types = ['Top', 'Bottom']

        for product_type in product_types:
            categories_info['types'].append(product_type)
            categories_info['amounts'].append(Product.objects.filter(product_type=product_type).count())
        json_response = json.dumps(categories_info)
        context['jsonResponse'] = json_response
        context['filters'] = self.request.GET.getlist('filter')
        return context

    def get_queryset(self):
        order_by = self.request.GET.get('order_by')
        # List of strings of filter parameters
        filters = self.request.GET.getlist('filter')
        if order_by:
            if order_by == 'pricedesc':
                if filters:
                    return Product.objects.all().order_by('-price').filter(product_type__in=filters)
                else:
                    return Product.objects.all().order_by('-price')

            elif order_by == 'priceascend':
                if filters:
                    return Product.objects.all().order_by('price').filter(product_type__in=filters)
                else:
                    return Product.objects.all().order_by('price')
        elif filters:
            return Product.objects.all().filter(product_type__in=filters)
        else:
            return super().get_queryset()


class ProductCreateView(View):
    template_name = 'main/create_product.html'
    success_url = reverse_lazy('add-clothing')

    def get(self, request):
        context = {'image_formset': ImageFormset, 'form': ProductForm}
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        # Forms
        product_form = ProductForm(request.POST, request.FILES)
        image_formset = ImageFormset(request.POST, request.FILES)

        if product_form.is_valid() and image_formset.is_valid():
            product_instance = product_form.save(commit=False)
            product_instance.save()
            for form in image_formset:
                # Only save if an image has been provided
                if form.cleaned_data.get('picture'):
                    image_instance = form.save(commit=False)
                    image_instance.product = product_instance
                    image_instance.save()
            return HttpResponseRedirect(self.success_url)
        else:
            context = {'image_formset': ImageFormset(self.request.POST), 'form': ProductForm(self.request.POST)}
            return render(self.request, self.template_name, context)


class ProductDetailView(DetailView):
    model = Product
    fields = ['product_name', 'product_type', 'price', 'description']
    template_name = 'main/product_page.html'


class BasketPageView(TemplateView):
    template_name = 'main/basket_page.html'
    paginate = 10
    model = Product

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['products'] = []
        # Get products from basket
        for product_id, product_amount in self.request.session['basket'].items():
            # Append a dictionary so indexing the html file is clearer
            context['products'].append(
                {'product': Product.objects.get(pk=int(product_id)), 'product_amount': product_amount})
        return context


class SaveToBasketView(View):

    def get(self, request):
        return JsonResponse(request.session['basket'])

    def post(self, request):
        # Post method to save items to a basket in the request session
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        # Int version of product_id
        product_id = str(body['productId'])
        if 'basket' in request.session and product_id in request.session['basket']:
            request.session['basket'][product_id] += 1
        else:
            request.session['basket'] = {product_id: 1}
        print(request.session['basket'])
        return HttpResponse(status=200)


class TestApiView(View):

    def get(self, request):
        print('getting json')
        data = {'student_id': 3}
        return JsonResponse(data)
