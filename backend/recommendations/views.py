from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from activities.models import Activity
from bookings.models import Booking
from chat.views import get_segment
from hotels.models import Hotel
from offers.models import Offer
from places.models import Place
from restaurants.models import Restaurant
from reviews.models import Review

TOP_N = 3
SEGMENTS = ('tourist', 'student', 'retired')
GROUPS = [
    ('hotel', 'Hotels', Hotel),
    ('restaurant', 'Restaurants', Restaurant),
    ('place', 'Places', Place),
    ('activity', 'Activities', Activity),
]


def is_budget(kind, o):
    if kind in ('hotel', 'restaurant'):
        return len(o.price_range) <= 2
    if kind == 'place':
        return o.entrance_fee is not None and o.entrance_fee <= 5
    return o.price <= 25


def price_text(kind, o):
    if kind in ('hotel', 'restaurant'):
        return o.price_range
    if kind == 'place':
        if o.entrance_fee is None:
            return 'Fee not listed'
        return 'Free' if o.entrance_fee == 0 else '$%s' % o.entrance_fee
    return 'Free' if o.price == 0 else '$%s' % o.price


def score_item(kind, o, segment, rating, bookings, offer_keys):
    score = 0.0
    reasons = []
    if rating:
        score += rating['avg'] * 2
        reasons.append('Rated %.1f (%d review%s)' % (rating['avg'], rating['n'], '' if rating['n'] == 1 else 's'))
    if bookings:
        score += min(bookings, 5)
        reasons.append('Popular: booked by other users')
    if kind == 'hotel' and o.stars >= 4:
        score += o.stars * 0.5
        reasons.append('%d-star hotel' % o.stars)
    if (kind, o.id) in offer_keys:
        score += 5
        reasons.append('%s offer available' % segment.capitalize())
    if segment == 'student' and is_budget(kind, o):
        score += 4
        reasons.append('Budget-friendly')
    if segment == 'retired':
        if o.accessibility == 'accessible':
            score += 6
            reasons.append('Wheelchair accessible')
        elif o.accessibility == 'partial':
            score += 3
            reasons.append('Partly accessible')
        elif o.accessibility == 'unknown':
            reasons.append('Accessibility not listed')
    return score, reasons


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def recommendations(request):
    seg = get_segment(request)
    personalised = seg in SEGMENTS
    segment = seg if personalised else 'tourist'

    today = timezone.localdate()
    seg_offers = (Offer.objects
                  .filter(is_active=True, segment=segment, valid_from__lte=today)
                  .filter(Q(valid_to__isnull=True) | Q(valid_to__gte=today)))
    offer_keys = {(o.listing_type, o.listing_id) for o in seg_offers if o.listing_type and o.listing_id}

    groups = []
    for kind, label, Model in GROUPS:
        ratings = {r['listing_id']: {'avg': r['avg'], 'n': r['n']}
                   for r in (Review.objects.filter(listing_type=kind).order_by()
                             .values('listing_id').annotate(avg=Avg('rating'), n=Count('id')))}
        booked = {b['item_id']: b['n']
                  for b in (Booking.objects.filter(booking_type=kind).order_by()
                            .values('item_id').annotate(n=Count('id')))}
        ranked, unranked = [], []
        for o in Model.objects.all():
            if segment == 'retired' and o.accessibility == 'not_accessible':
                continue
            score, reasons = score_item(kind, o, segment, ratings.get(o.id), booked.get(o.id, 0), offer_keys)
            entry = (score, o.name.lower(), o, reasons)
            (ranked if score > 0 else unranked).append(entry)
        ranked.sort(key=lambda x: (-x[0], x[1]))
        unranked.sort(key=lambda x: x[1])
        picks = [(e, True) for e in ranked[:TOP_N]]
        picks += [(e, False) for e in unranked[:max(0, TOP_N - len(picks))]]
        items = []
        for (score, _, o, reasons), is_ranked in picks:
            items.append({
                'id': o.id, 'kind': kind, 'name': o.name, 'region': o.governorate,
                'price': price_text(kind, o), 'image_url': o.image_url,
                'accessibility': o.accessibility, 'ranked': is_ranked,
                'reasons': reasons if reasons else ['Not ranked yet: no reviews or offers'],
            })
        groups.append({'type': kind, 'label': label, 'items': items})

    return Response({'segment': segment, 'personalised': personalised, 'groups': groups})
