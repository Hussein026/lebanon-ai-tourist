import time
import requests
from django.core.management.base import BaseCommand
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place


def geocode(name, location=None, governorate=None):
    query = name
    if location:
        query += f", {location}"
    if governorate:
        query += f", {governorate}"
    query += ", Lebanon"

    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": query, "format": "json", "limit": 1}
    headers = {"User-Agent": "LebanonAI/1.0"}

    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"  Error: {e}")
    return None, None


class Command(BaseCommand):
    help = "Geocode all hotels, restaurants, and places using Nominatim"

    def handle(self, *args, **kwargs):
        models_config = [
            (Hotel, "hotels", "location"),
            (Restaurant, "restaurants", "location"),
            (Place, "places", None),
        ]

        for Model, label, loc_field in models_config:
            self.stdout.write(f"\n--- Geocoding {label} ---")
            qs = Model.objects.filter(lat__isnull=True)
            self.stdout.write(f"Found {qs.count()} without coordinates")

            for obj in qs:
                location = getattr(obj, loc_field) if loc_field else None
                lat, lng = geocode(obj.name, location, obj.governorate)
                if lat:
                    obj.lat = lat
                    obj.lng = lng
                    obj.save()
                    self.stdout.write(f"  ✓ {obj.name} → {lat}, {lng}")
                else:
                    self.stdout.write(f"  ✗ {obj.name} → not found")
                time.sleep(1)  # Nominatim rate limit

        self.stdout.write("\nDone!")