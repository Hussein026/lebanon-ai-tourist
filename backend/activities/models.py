from django.db import models

class Activity(models.Model):
    TYPE_CHOICES = [
        ('hiking', 'Hiking'),
        ('water', 'Water Sports'),
        ('nightlife', 'Nightlife'),
        ('cultural', 'Cultural'),
        ('adventure', 'Adventure'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    location = models.CharField(max_length=255)
    governorate = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    duration = models.CharField(max_length=100, blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name