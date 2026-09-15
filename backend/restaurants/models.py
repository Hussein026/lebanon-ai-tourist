from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cuisine_type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    governorate = models.CharField(max_length=100)
    price_range = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, blank=True)
    is_vegetarian = models.BooleanField(default=False)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name