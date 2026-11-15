from django.db import models


class HikingRoute(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('hard', 'Hard'),
        ('unknown', 'Not rated'),
    ]
    name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    distance_km = models.DecimalField(max_digits=6, decimal_places=1)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='unknown')
    description = models.TextField(blank=True)
    path = models.JSONField(default=list)
    start_lat = models.FloatField(null=True, blank=True)
    start_lng = models.FloatField(null=True, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
