from django.db import models

class Taxi(models.Model):
    driver_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    area_covered = models.CharField(max_length=255)
    price_per_km = models.DecimalField(max_digits=6, decimal_places=2)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.driver_name