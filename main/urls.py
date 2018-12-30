from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path, reverse_lazy
from django.contrib.auth import login
from main import views as m_views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
                  path('home/', m_views.HomePageView.as_view(), name='home'),
                  path('clothing/', m_views.MainPageView.as_view(), name='main'),
                  path('clothing/<int:pk>', m_views.ProductDetailView.as_view(), name='product-detail'),
                  path('clothing/add', m_views.ProductCreateView.as_view(), name='add-clothing'),
                  path('basket/save/', m_views.SaveToBasketView.as_view(), name='basket'),
                  path('basket/', m_views.BasketPageView.as_view(), name='view-basket'),
                  path('api/test/', m_views.TestApiView.as_view(), name='test-api'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
