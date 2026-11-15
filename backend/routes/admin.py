from django.contrib import admin
from .models import HikingRoute


@admin.register(HikingRoute)
class HikingRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'region', 'distance_km', 'difficulty', 'is_active')
    list_display_links = ('name',)
    list_editable = ('difficulty', 'is_active')
    search_fields = ('name', 'region')
