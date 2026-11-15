from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'listing_type', 'listing_id', 'rating', 'updated_at')
    list_filter = ('listing_type', 'rating')
    search_fields = ('user__username', 'comment')
