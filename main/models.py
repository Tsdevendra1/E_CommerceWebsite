from django.db import models

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify
from django_common.auth_backends import User


class Product(models.Model):
    product_name = models.CharField(blank=False, null=False, max_length=75)
    PRODUCT_TYPES = (
        ('Top', 'Top'),
        ('Bottom', 'Bottom'),
    )
    product_type = models.CharField(choices=PRODUCT_TYPES, max_length=256, blank=False, null=False)
    price = models.PositiveIntegerField(verbose_name='Price (£) ')
    description = models.CharField(blank=False, null=False, max_length=256)
    thumbnail = models.ImageField(upload_to='main/images/', help_text='This will be the thumbnail shown to customers')


def get_image_filename(instance, filename):
    title = instance.product.product_name
    slug = slugify(title)
    return "main/images/{}-{}".format(slug, filename)


class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to=get_image_filename,
                                 verbose_name='Picture', help_text='This will be displayed on the product page')


