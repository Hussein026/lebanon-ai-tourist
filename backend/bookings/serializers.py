import re
from rest_framework import serializers
from .models import Booking

PHONE_RE = re.compile(r'^[0-9+\-\s()]{6,20}$')
MAX_GUESTS = 50
MAX_REQUESTS = 1000


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

    def validate_guests(self, value):
        if value < 1 or value > MAX_GUESTS:
            raise serializers.ValidationError(f'Guests must be between 1 and {MAX_GUESTS}.')
        return value

    def validate_phone(self, value):
        value = value.strip()
        if not PHONE_RE.match(value):
            raise serializers.ValidationError('Enter a valid phone number.')
        return value

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError('Enter your full name.')
        return value

    def validate_special_requests(self, value):
        value = value.strip()
        if len(value) > MAX_REQUESTS:
            raise serializers.ValidationError(f'Maximum {MAX_REQUESTS} characters.')
        return value

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        if check_in and check_out and check_out < check_in:
            raise serializers.ValidationError({'check_out': 'Check-out must be after check-in.'})
        return data
