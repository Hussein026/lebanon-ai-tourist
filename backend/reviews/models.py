from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Review(models.Model):
    LISTING_CHOICES = [
        ('hotel', 'Hotel'),
        ('restaurant', 'Restaurant'),
        ('place', 'Place'),
        ('activity', 'Activity'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    listing_type = models.CharField(max_length=20, choices=LISTING_CHOICES)
    listing_id = models.PositiveIntegerField()
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'listing_type', 'listing_id')
        ordering = ['-updated_at']

    def __str__(self):
        return '%s %s #%s: %s stars' % (self.user.username, self.listing_type, self.listing_id, self.rating)
