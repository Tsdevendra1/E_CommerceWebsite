# Generated by Django 2.0.1 on 2018-12-17 18:06

from django.db import migrations, models
import django.db.models.deletion
import main.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20181217_1212'),
    ]

    operations = [
        migrations.CreateModel(
            name='Images',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pictures', models.ImageField(help_text='This will be displayed on the product page', upload_to=main.models.get_image_filename, verbose_name='Picture')),
            ],
        ),
        migrations.RemoveField(
            model_name='product',
            name='pictures',
        ),
        migrations.AddField(
            model_name='product',
            name='product_name',
            field=models.TextField(default='test'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='product',
            name='thumbnail',
            field=models.ImageField(default='random', help_text='This will be the thumbnail shown to customers', upload_to='main/images/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='images',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Product'),
        ),
    ]
