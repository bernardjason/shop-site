# Generated by Django 4.1.5 on 2023-02-12 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0011_stock_stockid_alter_login_userid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='stockId',
            field=models.CharField(max_length=32, unique=True, verbose_name='external identifier'),
        ),
    ]
