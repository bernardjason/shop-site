from django.test import TestCase
from .models import Basket, Login, Stock
from django.test.client import RequestFactory
from . import view_basket
import json


class BasketTestCase(TestCase):
    def setUp(self):
        login = Login.objects.create(userName='hello world', userId="hello")
        stock = Stock.objects.create(stockId='abc111111', description="bar of soap", name="soap", numberOf=5)
        self.stockToAdd = Stock.objects.create(stockId='abc222222', description="add to basket", name="helloworld",
                                               numberOf=5)
        Basket.objects.create(basketId="hello-1", numberOf=2, stockId=stock)
        self.factory = RequestFactory()
        for i in Stock.objects.values():
            print("STOCK   ", i)
        for i in Basket.objects.values():
            print("BASKET  ", i)

    def test_getbasket(self):
        """Did we get the basket item"""
        request = self.factory.get('/basket', content_type="application/json")
        response = view_basket.get_basket(request, basketId="hello-1", userId="hello")
        json_data = json.loads(response.content)
        item = json_data['items'][0]
        self.assertEqual(item['name'], "soap")
        self.assertEqual(item['numberOf'], 2)
        self.assertEqual(item['key'], 'abc111111')
        self.assertEqual(item['stockId'], 'abc111111')
        self.assertEquals(response.status_code, 200)

    def test_addtobasket(self):
        """add an item to existing basket"""
        item = {'name': self.stockToAdd.name, 'numberOf': 2, 'description': self.stockToAdd.description,
                'stockId': self.stockToAdd.stockId}
        request_data = {
            "basketId": "hello-1",
            "userId": "hello",
            "items": [
                item
            ]
        }
        request = self.factory.post('/basket/hello-1', content_type="application/json",
                                    data=json.dumps(request_data))
        response = view_basket.post_basket(request)
        json_data = json.loads(response.content)
        item = json_data['items'][0]
        self.assertEqual(item['name'], "soap")
        self.assertEqual(item['numberOf'], 2)
        self.assertEqual(item['key'], 'abc111111')
        self.assertEqual(item['stockId'], 'abc111111')
        item = json_data['items'][1]
        self.assertEqual(item['name'], self.stockToAdd.name)
        self.assertEqual(item['numberOf'], 2)
        self.assertEqual(item['key'], 'abc222222')
        self.assertEqual(item['stockId'], self.stockToAdd.stockId)

        self.assertEquals(response.status_code, 201)

    def test_delete_from_basket(self):
        """delete an item to existing basket should leave 1 of them left"""
        item = {'name': self.stockToAdd.name, 'numberOf': 1, 'description': self.stockToAdd.description,
                'stockId': self.stockToAdd.stockId}
        request_data = {
            "basketId": "hello-1",
            "userId": "hello",
            "items": [
                item
            ]
        }
        request = self.factory.delete('/basket/hello-1', content_type="application/json",
                                      data=json.dumps(request_data))
        response = view_basket.post_basket(request)
        json_data = json.loads(response.content)
        item = json_data['items'][0]
        self.assertEqual(item['name'], "soap")
        self.assertEqual(item['numberOf'], 2)
        self.assertEqual(item['key'], 'abc111111')
        self.assertEqual(item['stockId'], 'abc111111')
        item = json_data['items'][1]
        self.assertEqual(item['name'], self.stockToAdd.name)
        self.assertEqual(item['numberOf'], 1)
        self.assertEqual(item['key'], 'abc222222')
        self.assertEqual(item['stockId'], self.stockToAdd.stockId)

        self.assertEquals(response.status_code, 201)
