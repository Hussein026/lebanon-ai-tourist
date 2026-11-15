from django.db import models
from django.utils import timezone


class Offer(models.Model):
    SEGMENT_CHOICES = [
        ('all', 'Everyone'),
        ('tourist', 'Tourists'),
        ('student', 'Students'),
        ('retired', 'Retired'),
    ]
    LISTING_CHOICES = [
        ('', 'None'),
        ('hotel', 'Hotel'),
        ('restaurant', 'Restaurant'),
        ('place', 'Place'),
        ('activity', 'Activity'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    discount_text = models.CharField(max_length=100, blank=True)
    segment = models.CharField(max_length=20, choices=SEGMENT_CHOICES, default='all')
    listing_type = models.CharField(max_length=20, choices=LISTING_CHOICES, blank=True)
    listing_id = models.PositiveIntegerField(null=True, blank=True)
    valid_from = models.DateField(default=timezone.localdate)
    valid_to = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
