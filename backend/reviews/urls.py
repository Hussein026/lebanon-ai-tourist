from django.urls import path
from . import views

urlpatterns = [
    path('summary/', views.summary, name='review-summary'),
    path('', views.ReviewView.as_view(), name='reviews'),
]
