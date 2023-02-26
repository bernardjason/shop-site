from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpRequest
from django.core import serializers
from .models import Stock, Basket, Login
import json
from django.db.models import Prefetch
import uuid
from django.db import transaction
import logging
import time,random

# Create your views here.

logger = logging.getLogger('shop')

def random_pause():
    sleep = random.uniform(0.0,1.0)
    logger.info("SLEEP ..... "+str(sleep))
    time.sleep(sleep)


def get_stock(request):
    all_stock = Stock.objects.order_by('name').values('stockId','name','numberOf','description')
    json_data = JsonResponse({"stock": list(all_stock)},status=200)
    random_pause()
    return json_data