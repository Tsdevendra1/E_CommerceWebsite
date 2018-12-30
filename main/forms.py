from django import forms
from django.forms import formset_factory

from main.models import Image, Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['product_name', 'product_type', 'price', 'thumbnail', 'description']


class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['picture']


ImageFormset = formset_factory(ImageForm, extra=4, max_num=4, min_num=1)
