from rest_framework import serializers
from .models import HikingRoute


class HikingRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HikingRoute
        fields = ['id', 'name', 'region', 'distance_km', 'difficulty', 'description',
                  'path', 'start_lat', 'start_lng', 'source_url']
