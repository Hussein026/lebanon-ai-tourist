from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Count
from django.db.models.functions import TruncMonth
from bookings.models import Booking
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place
from activities.models import Activity
from users.models import UserProfile
from .permissions import IsMinistry


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsMinistry])
def dashboard_stats(request):
    total_bookings = Booking.objects.count()
    pending = Booking.objects.filter(status='pending').count()
    confirmed = Booking.objects.filter(status='confirmed').count()
    cancelled = Booking.objects.filter(status='cancelled').count()

    bookings_by_type = list(
        Booking.objects.values('booking_type')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    bookings_by_governorate = list(
        Booking.objects.values('item_name')
        .annotate(count=Count('id'))
        .order_by('-count')[:10]
    )

    monthly_bookings = list(
        Booking.objects.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')[:12]
    )

    recent_bookings = list(
        Booking.objects.order_by('-created_at')[:10]
        .values('id', 'booking_type', 'item_name', 'full_name', 'email', 'status', 'created_at')
    )

    users_per_segment = list(
        UserProfile.objects.values('segment')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return Response({
        'totals': {
            'bookings': total_bookings,
            'hotels': Hotel.objects.count(),
            'restaurants': Restaurant.objects.count(),
            'places': Place.objects.count(),
            'activities': Activity.objects.count(),
            'pending': pending,
            'confirmed': confirmed,
            'cancelled': cancelled,
        },
        'bookings_by_type': bookings_by_type,
        'bookings_by_governorate': bookings_by_governorate,
        'monthly_bookings': [
            {'month': m['month'].strftime('%b %Y'), 'count': m['count']}
            for m in monthly_bookings
        ],
        'recent_bookings': recent_bookings,
        'users_per_segment': users_per_segment,
    })


@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsMinistry])
def update_booking_status(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        status = request.data.get('status')
        if status in ['pending', 'confirmed', 'cancelled']:
            booking.status = status
            booking.save()
            return Response({'message': 'Status updated.'})
        return Response({'error': 'Invalid status.'}, status=400)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found.'}, status=404)
