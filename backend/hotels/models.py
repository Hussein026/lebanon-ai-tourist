from django.db import models
ACCESSIBILITY_CHOICES = [
    ('unknown', 'Unknown'),
    ('accessible', 'Wheelchair accessible'),
    ('partial', 'Partly accessible'),
    ('not_accessible', 'Not accessible'),
]
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    governorate = models.CharField(max_length=100)
    price_range = models.CharField(max_length=50)
    stars = models.IntegerField(default=3)
    phone = models.CharField(max_length=20, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    accessibility = models.CharField(max_length=20, choices=ACCESSIBILITY_CHOICES, default='unknown')
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
