from django.test import TestCase
from .models import Basket, Login, Stock
from django.test.client import RequestFactory
from . import view_checkout
import json


class CheckoutTestCase(TestCase):
    def setUp(self):
        login = Login.objects.create(userName='hello world', userId="hello")
        self.stock = Stock.objects.create(stockId='abc123', description="bar of soap", name="soap", numberOf=5)
        self.stockToAdd = Stock.objects.create(stockId='abc456', description="add to basket", name="helloworld",
                                               numberOf=5)
        Basket.objects.create(basketId="hello-1", numberOf=2, stockId=self.stock)
        Basket.objects.create(basketId="hello-1", numberOf=2, stockId=self.stockToAdd)
        self.factory = RequestFactory()

    def test_checkout(self):
        """checkout basket"""
        item1 = {'name': self.stock.name, 'numberOf': 2, 'description': self.stock.description,
                 'key': self.stock.stockId, 'stockId': self.stock.stockId}
        item2 = {'name': self.stockToAdd.name, 'numberOf': 2, 'description': self.stockToAdd.description,
                 'key': self.stockToAdd.id, 'stockId': self.stockToAdd.stockId}
        request_data = {
            "basketId": "hello-1",
            "userId": "hello",
            "address": {"line1": "the house", "line2": "the postcode"},
            "items": [
                item1,
                item2
            ]
        }
        request = self.factory.post('/checkout', content_type="application/json",
                                    data=json.dumps(request_data))
        response = view_checkout.checkout(request)
        json_data = json.loads(response.content)
        items = json_data['items']
        self.assertEquals(0, len(items))
        self.assertEquals({'line1': 'the house', 'line2': 'the postcode'}, json_data['address'])
        self.assertEquals(
            {'basketId': 'hello-1', 'message': 'Dispatched', 'address': {'line1': 'the house', 'line2': 'the postcode'},
             'items': []},
            json_data)
        self.assertEquals(response.status_code, 201)
