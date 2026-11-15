from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place
from activities.models import Activity
from .models import Review

MODELS = {'hotel': Hotel, 'restaurant': Restaurant, 'place': Place, 'activity': Activity}
MAX_COMMENT = 1000


@api_view(['GET'])
@permission_classes([AllowAny])
def summary(request):
    t = request.query_params.get('type')
    if t not in MODELS:
        return Response({'error': 'Invalid type.'}, status=400)
    rows = (Review.objects.filter(listing_type=t).order_by()
            .values('listing_id').annotate(avg=Avg('rating'), count=Count('id')))
    return Response({str(r['listing_id']): {'avg': round(r['avg'], 1), 'count': r['count']} for r in rows})


class ReviewView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        t = request.query_params.get('type')
        if t not in MODELS:
            return Response({'error': 'Invalid type.'}, status=400)
        try:
            lid = int(request.query_params.get('id'))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid id.'}, status=400)
        qs = Review.objects.filter(listing_type=t, listing_id=lid).select_related('user')
        return Response([
            {'id': r.id, 'username': r.user.username, 'rating': r.rating,
             'comment': r.comment, 'updated_at': r.updated_at}
            for r in qs
        ])

    def post(self, request):
        t = request.data.get('listing_type')
        if t not in MODELS:
            return Response({'error': 'Invalid type.'}, status=400)
        try:
            lid = int(request.data.get('listing_id'))
            rating = int(request.data.get('rating'))
        except (TypeError, ValueError):
            return Response({'error': 'listing_id and rating must be numbers.'}, status=400)
        if rating < 1 or rating > 5:
            return Response({'error': 'Rating must be 1 to 5.'}, status=400)
        if not MODELS[t].objects.filter(id=lid).exists():
            return Response({'error': 'Listing not found.'}, status=404)
        comment = str(request.data.get('comment', '')).strip()[:MAX_COMMENT]
        obj, created = Review.objects.update_or_create(
            user=request.user, listing_type=t, listing_id=lid,
            defaults={'rating': rating, 'comment': comment},
        )
        return Response({'id': obj.id, 'rating': obj.rating, 'comment': obj.comment},
                        status=201 if created else 200)
