from django.db import models
from django.conf import settings


class Pincode(models.Model):
    pincode = models.CharField(max_length=6, unique=True)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.CharField(max_length=10, null=True)
    longitude = models.CharField(max_length=10, null=True)
    last_update = models.DateTimeField(auto_now=True)
