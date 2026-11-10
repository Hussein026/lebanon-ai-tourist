from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    SEGMENT_CHOICES = [
        ('tourist', 'Tourist'),
        ('student', 'Student'),
        ('retired', 'Retired'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    segment = models.CharField(max_length=20, choices=SEGMENT_CHOICES, default='tourist')
    nationality = models.CharField(max_length=100, blank=True)

    # Student fields
    university = models.CharField(max_length=255, blank=True)
    student_id = models.CharField(max_length=100, blank=True)

    # Retired fields (private, only the owner can see them)
    health_conditions = models.TextField(blank=True)
    mobility_issues = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.segment}"
