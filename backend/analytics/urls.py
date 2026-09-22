from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard_stats, name='dashboard'),
    path('bookings/<int:pk>/status/', views.update_booking_status, name='update-status'),
]