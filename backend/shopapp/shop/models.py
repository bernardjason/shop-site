from django.db import models

# Create your models here.

class Stock(models.Model):
	stockId = models.CharField("external identifier",max_length=32,unique=True)
	name = models.CharField("stock item name",max_length=64)
	numberOf = models.IntegerField("number of stock, basket items excluded until purchased")
	description = models.CharField("stock description",max_length=256)

	def __str__(self):
		return f"stockId={self.stockId} name={self.name} numberOf={self.numberOf} description={self.description}"

class Login(models.Model):
	userId = models.CharField("external identifier",max_length=32,unique=True)
	userName = models.CharField("login user name",max_length=32)
	lastBasket = models.CharField("login's last basket id",max_length=32)

	def __str(self):
		return f"id={self.id} userId={self.userId} userName={self.userName}"

class Basket(models.Model):
	id = models.IntegerField(primary_key=True)
	basketId = models.CharField("number of the basket",max_length=32)
	#userId = models.ForeignKey(Login, on_delete=models.SET_DEFAULT, default="-1",to_field='userId' , null=True,blank=True)
	stockId = models.ForeignKey(Stock, to_field='stockId' , on_delete=models.SET_DEFAULT,default=-1)
	numberOf = models.IntegerField("number of items in basket")

	def __str(self):
		return f"id={self.id} basketId={self.basketId} numberOf={self.numberOf} stockId={self.stockId}"