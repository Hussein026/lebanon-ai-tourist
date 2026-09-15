from rest_framework import viewsets
from .models import Taxi
from .serializers import TaxiSerializer

class TaxiViewSet(viewsets.ModelViewSet):
    queryset = Taxi.objects.all()
    serializer_class = TaxiSerializer