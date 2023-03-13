import logging

import django.middleware.csrf

# Create your views here.

logger = logging.getLogger('shop')

from django.shortcuts import render
def index(request):
    response = render(request, 'index.html')
    response['X-CSRFToken'] = django.middleware.csrf.get_token(request)
    return render(request, 'index.html')