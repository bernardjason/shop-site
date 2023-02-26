from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpRequest
from django.core import serializers
from .models import Stock, Basket, Login
import json
from django.db.models import Prefetch
import uuid
from django.db import transaction
import logging
import uuid

# Create your views here.

logger = logging.getLogger('shop')

def post_check_login(request):
    json_request = json.loads(request.body)

    logger.debug("Login request ",json_request)

    name = json_request['name']
    password = json_request['password']

    logger.info("login check for {}".format(name))

    if len(password) <=1 :
        logger.error("if password too short assume bad")
        return HttpResponse(status=401)        

    login = Login.objects.filter(userName=name).values()
    if login.count() == 1 :
        login = login.get()
        new_userId=str(uuid.uuid4() )
        new_basketId=str(uuid.uuid4() )
        Basket.objects.filter(basketId=login['lastBasket']).update(basketId=new_basketId)
        login['lastBasket'] = new_basketId
        Login.objects.filter(userName=name).update(lastBasket=new_basketId,userId=new_userId)
        response = { 'userId': new_userId ,'userName': login['userName'],"basketId":new_basketId }
    else:
        response = { 'error': 'no such login found'}
    
    logger.debug(response)
    json_data = JsonResponse(response,status=201)
    return json_data