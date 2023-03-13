import logging
import time

from django.http import JsonResponse

from .models import Stock

# Create your views here.

logger = logging.getLogger('shop')

def random_pause():
    sleep = 0.0 # random.uniform(0.0,1.0)
    logger.info("SLEEP ..... "+str(sleep))
    time.sleep(sleep)


def get_stock(request):
    all_stock = Stock.objects.order_by('name').values('stockId','name','numberOf','description')
    json_data = JsonResponse({"stock": list(all_stock)},status=200)
    random_pause()
    return json_data
