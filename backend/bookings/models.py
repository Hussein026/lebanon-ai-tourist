from django.db import models

class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
    ('hotel', 'Hotel'),
    ('restaurant', 'Restaurant'),
    ('activity', 'Activity'),
    ('taxi', 'Taxi'),
    ('place', 'Place'),
]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES)
    item_id = models.IntegerField()
    item_name = models.CharField(max_length=255)

    # Guest info
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    nationality = models.CharField(max_length=100, blank=True)

    # Booking details
    check_in = models.DateField(null=True, blank=True)
    check_out = models.DateField(null=True, blank=True)
    guests = models.IntegerField(default=1)
    special_requests = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_type} - {self.item_name} - {self.full_name}"