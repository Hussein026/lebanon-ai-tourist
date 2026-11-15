from rest_framework import serializers
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place
from activities.models import Activity
from .models import Offer

LISTING_MODELS = {
    'hotel': Hotel,
    'restaurant': Restaurant,
    'place': Place,
    'activity': Activity,
}


class OfferSerializer(serializers.ModelSerializer):
    listing_name = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'discount_text', 'segment',
                  'listing_type', 'listing_id', 'listing_name', 'valid_from', 'valid_to']

    def get_listing_name(self, obj):
        model = LISTING_MODELS.get(obj.listing_type)
        if not model or not obj.listing_id:
            return None
        item = model.objects.filter(id=obj.listing_id).first()
        return item.name if item else None
