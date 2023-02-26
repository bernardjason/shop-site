from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views
from . import view_basket
from . import view_checkout
from . import view_login
from . import view_stock
from django.conf import settings

def debug_csrf(fn):
    if settings.DEBUG:
        print("**** DEBUG CSRF DISABLED {}****".format(fn))
        return csrf_exempt(fn)
    else:
        return fn

urlpatterns = [
    path('stock',debug_csrf(view_stock.get_stock)),
    path('basket/<basketId>',debug_csrf(view_basket.basket)),
    path('basket/<basketId>/<userId>',debug_csrf(view_basket.basket)),
    path('basket',debug_csrf(view_basket.post_basket)),
    path('login',debug_csrf(view_login.post_check_login)),
    path('checkout',debug_csrf(view_checkout.checkout)),
]