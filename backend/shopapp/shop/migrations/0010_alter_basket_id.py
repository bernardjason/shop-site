# Generated by Django 4.1.5 on 2023-02-04 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0009_alter_basket_userid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='basket',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
