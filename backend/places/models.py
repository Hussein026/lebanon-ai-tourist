from django.db import models

class Place(models.Model):
    CATEGORY_CHOICES = [
        ('historical', 'Historical'),
        ('nature', 'Nature'),
        ('religious', 'Religious'),
        ('cultural', 'Cultural'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    governorate = models.CharField(max_length=100)
    entrance_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    opening_hours = models.CharField(max_length=100, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name