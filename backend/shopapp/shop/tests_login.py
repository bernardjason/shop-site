from django.test import TestCase
from .models import Login
from django.test.client import RequestFactory
from . import view_login
import json

class LoginTestCase(TestCase):
    def setUp(self):
        Login.objects.create(userName='testuser')
        self.factory = RequestFactory()

    def test_login_works(self):
        """login works as password supplied"""
        request = self.factory.post('/login', content_type="application/json",
                            data=json.dumps({"name":"testuser","password":"1233"}))
        response = view_login.post_check_login(request)
        self.assertEquals(response.status_code, 201)

    def test_login_fails(self):
        """login fails as password too short"""
        request = self.factory.post('/login', content_type="application/json",
                            data=json.dumps({"name":"testuser","password":""}))
        response = view_login.post_check_login(request)
        self.assertEquals(response.status_code, 401)