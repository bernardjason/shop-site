from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpRequest
from django.core import serializers
from .models import Stock, Basket, Login
import json
from django.db.models import Prefetch
import uuid
from django.db import transaction
import logging

from .view_basket import get_basket_from_db

# Create your views here.

logger = logging.getLogger('shop')

"""
I could ignore items in request and just use DB..
"""
@transaction.atomic
def checkout(request):
    json_request = json.loads(request.body)
    logger.debug(f"REQUEST {json_request}")

    basketId=json_request['basketId']
    items=json_request['items']
    address=json_request['address']
    userId=json_request['userId']

    login = Login.objects.filter(userId=userId).values()
    if login.count() != 1 :
        print(login.values())
        raise Exception("User not valid/mismatch")

    logger.info(f"checkout for {basketId} items len={len(items)}")

    # in support multiple items in one go
    failed=False
    errors=None
    for basket in items:
        numberOf=basket['numberOf']
        stockId=basket['stockId'] 
        key=basket['key']
        item=Basket.objects.get(basketId=basketId, stockId=stockId )
        stock= Stock.objects.select_for_update().filter(stockId=stockId).get()
        logger.debug(f"Basket item {item} stock is {stock}")
        if stock.numberOf >= item.numberOf :
            stock.numberOf=stock.numberOf-item.numberOf
            stock.save()
            item.delete()
            logger.info(f"Updated {stock} and deleted basket {item}")
        else:
            errors=f"not enough of item named '{stock.name}', requested {item.numberOf} but there are {stock.numberOf} in stock"
            transaction.set_rollback(True)
            failed=True
            break

    if failed :
        response = {
            "error": "failed",
            "message": errors
        }
        json_data = JsonResponse(response,status=400)
        logger.error("Errors ",json_data,response)
        return json_data

    items = get_basket_from_db(basketId)
    response = {"basketId":basketId,
        "message": "Dispatched",
        "address": address,
        "items":items}
    logger.debug("After post checkout",response)

    logger.info(f"Checkout success {basketId} ")

    json_data = JsonResponse(response,status=201)
    return json_data
