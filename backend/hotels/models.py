from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    governorate = models.CharField(max_length=100)
    price_range = models.CharField(max_length=50)
    stars = models.IntegerField(default=3)
    phone = models.CharField(max_length=20, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name