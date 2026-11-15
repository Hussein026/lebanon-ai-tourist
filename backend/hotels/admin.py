from django.contrib import admin
from .models import Hotel
@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'governorate', 'phone', 'accessibility', 'image_url')
    list_display_links = ('name',)
    list_editable = ('phone', 'accessibility', 'image_url')
    search_fields = ('name', 'governorate')
