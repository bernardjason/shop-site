from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpRequest
from django.core import serializers
from .models import Stock, Basket, Login
import json
from django.db.models import Prefetch
import uuid
from django.db import transaction
import logging
from django.db.models import Count, F, Value
import time
import random

# Create your views here.

logger = logging.getLogger('shop')

def random_pause():
    sleep = random.uniform(0.0,1.5)
    logger.info("SLEEP ..... "+str(sleep))
    time.sleep(sleep)

def basket(request:HttpRequest,basketId,userId=None):
    if request.method == "GET" :
        resp = get_basket(request, basketId, userId)
        random_pause()
        return resp
    elif request.method == "DELETE":
        return delete_basket(request, basketId)
    else:
        return HttpResponse(status=500)

def get_basket_from_db(basketId):
    # join on stock table using foriegn keys in basket but below separate queries for now, raw sql better probably
    logger.info(f"get_basket_from_db basket [{basketId}]")

    basket = None
    basket = Basket.objects.filter(basketId=basketId).select_related()

    #stock_ids = basket.values('id','stockId','numberOf')
    stock_ids = basket.values('stockId','numberOf')
    items=list()
    for i in range(0,basket.count()) :
        stock =stock_ids[i]
        key=stock['stockId']
        s=Stock.objects.filter(stockId=stock['stockId']).values().get()
        s['key']=key
        s.pop('id')
        s['numberOf']=stock['numberOf']
        s['stockId']=stock['stockId']
        items.append(s)

    return items

def validate_login(userId,basketId):
    if userId != None:
        login = Login.objects.filter(userId=userId).values()
        if login.count() != 1 :
            raise Exception("User not valid/mismatch")
    else:
        if Login.objects.filter(lastBasket=basketId).values().count() > 0 :
            raise Exception("That basket belongs to somebody")




def delete_basket(request,basketId):

    logger.debug("DELETE {} {}".format(basketId,request.body))
    random_pause()

    json_request = json.loads(request.body)
    items=json_request['items']
    basketId=json_request['basketId']
    userId = json_request['userId']
    validate_login(userId,basketId)

    logger.info("DELETE {} items len{}".format(basketId,len(items)))

    stockIds=list()
    primary_keys=list()
    for stock in items:
        stockId=stock['stockId'] 
        stockIds.append(stockId)
        pk=stock['key']
        primary_keys.append(pk)

    if logger.isEnabledFor(logging.DEBUG):
        logger.debug("Before delete "+str(get_basket_from_db(basketId)))
        logger.debug("Delete "+str(stockIds))
    Basket.objects.filter(basketId=basketId,stockId__in=stockIds).filter(stockId__in=primary_keys).delete()

    items = get_basket_from_db(basketId)
    response = {"basketId":basketId,"items":items}
    logger.debug("After delete basket",response)
    json_data = JsonResponse(response,status=202)
    return json_data

def get_basket(request,basketId,userId):
    # csrf_exempt in views.py

    items = get_basket_from_db(basketId)
    data = {"rows":len(items),"userId":userId,"basketId":basketId,"items":items}
    json_data = JsonResponse(data,status=200)
    if logger.isEnabledFor(logging.DEBUG):
        logger.debug("GET BASKET   "+str(json_data))
    return json_data

#@transaction.atomic
def post_basket(request):
    json_request = json.loads(request.body)
    logger.debug("REQUEST ",json_request)

    basketId=json_request['basketId']
    userId=json_request['userId']
    items=json_request['items']
    logger.info(f"Post basket {basketId} {userId}")
    validate_login(userId,basketId)

    random_pause()

    if basketId == -1 :
        basketId=str(uuid.uuid4() )

    """
    check using login if basketId ofr basket matches login basket. If not then do below
    """
    if userId != None and userId != "null":
        with transaction.atomic():
            login = Login.objects.filter(userId=userId).values().get()
            userId=login['userId']
            if login['lastBasket'] != basketId:
                new_basketId = login['lastBasket']
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(Basket.objects.filter(basketId=basketId).query)
    
                anon_basket = Basket.objects.filter(basketId=basketId).values()
                for b in anon_basket:
                    updated=Basket.objects.filter(basketId=new_basketId,stockId=b['stockId_id']).update(numberOf=F('numberOf')+b['numberOf'])
                    if updated > 0 :
                        logger.debug(f"updated user basket with anon item {b}")
                        Basket.objects.filter(pk=b['id']).delete()
    
                Basket.objects.filter(basketId=basketId).update(basketId=new_basketId)
    
                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug(f"Basket id is now {new_basketId} was {basketId}")
                basketId=new_basketId


    logger.debug("Post basketId={} userId={}".format(basketId,userId))

    to_add=list()
    to_update=[]
    for basket in items:
        numberOf=basket['numberOf']
        stockId=basket['stockId'] 
        stock = Stock.objects.get(stockId=stockId)
        already_exists = Basket.objects.filter(basketId=basketId,stockId=stockId)
        if already_exists.count() > 0 :
            # basket update has db duplicates update existing or remove if zero
            for decrease in already_exists:
                decrease.numberOf = decrease.numberOf + numberOf
                if decrease.numberOf <= 0 :
                    logger.info("removed item that had zero numberOf")
                    decrease.delete()
                else :
                    to_update.append(decrease)
        else :
            basket= Basket(basketId=basketId,numberOf=numberOf,stockId=stock)
            to_add.append(basket)

    Basket.objects.bulk_update(to_update,['numberOf'])
    Basket.objects.bulk_create(to_add)

    items = get_basket_from_db(basketId)
    response = {"basketId":basketId,"userId":userId,"items":items}
    logger.debug("After post basket",response)
    json_data = JsonResponse(response,status=201)
    return json_data


