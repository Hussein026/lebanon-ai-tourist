from django.contrib import admin
from .models import Offer


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'segment', 'listing_type', 'listing_id',
                    'valid_from', 'valid_to', 'is_active')
    list_display_links = ('title',)
    list_editable = ('is_active',)
    list_filter = ('segment', 'is_active')
    search_fields = ('title', 'description')
