from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import HikingRoute
from .serializers import HikingRouteSerializer


class RouteListView(generics.ListAPIView):
    serializer_class = HikingRouteSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    pagination_class = None

    def get_queryset(self):
        return HikingRoute.objects.filter(is_active=True).order_by('name')
