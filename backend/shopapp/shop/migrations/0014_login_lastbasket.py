# Generated by Django 4.1.5 on 2023-02-19 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0013_alter_basket_stockid'),
    ]

    operations = [
        migrations.AddField(
            model_name='login',
            name='lastBasket',
            field=models.CharField(default='hello last basket', max_length=32, verbose_name="login's last basket id"),
            preserve_default=False,
        ),
    ]