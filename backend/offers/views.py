from django.db.models import Q
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def offer_list(request):
    # FR-12: a user sees offers for their own segment plus offers for everyone.
    today = timezone.localdate()
    segments = ['all']
    if request.user and request.user.is_authenticated:
        profile = getattr(request.user, 'profile', None)
        if profile and profile.segment:
            segments.append(profile.segment)
    qs = (Offer.objects
          .filter(is_active=True, segment__in=segments, valid_from__lte=today)
          .filter(Q(valid_to__isnull=True) | Q(valid_to__gte=today))
          .order_by('-created_at'))
    return Response(OfferSerializer(qs, many=True).data)
