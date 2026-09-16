from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hotels.views import HotelViewSet
from restaurants.views import RestaurantViewSet
from places.views import PlaceViewSet
from activities.views import ActivityViewSet
from taxis.views import TaxiViewSet
from chat.views import chat

router = DefaultRouter()
router.register(r'hotels', HotelViewSet)
router.register(r'restaurants', RestaurantViewSet)
router.register(r'places', PlaceViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'taxis', TaxiViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/chat/', chat),
]