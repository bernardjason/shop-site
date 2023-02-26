from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpRequest
from django.core import serializers
from .models import Stock, Basket, Login
import json
from django.db.models import Prefetch
import uuid
from django.db import transaction
import logging
import django.middleware.csrf

# Create your views here.

logger = logging.getLogger('shop')

from django.shortcuts import render
def index(request):
    response = render(request, 'index.html')
    response['X-CSRFToken'] = django.middleware.csrf.get_token(request)
    return render(request, 'index.html')