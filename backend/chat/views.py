import re
import unicodedata

import requests
from django.db.models import Q
from django.utils import timezone
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from activities.models import Activity
from hotels.models import Hotel
from offers.models import Offer
from offers.serializers import OfferSerializer
from places.models import Place
from restaurants.models import Restaurant
from routes.models import HikingRoute
from .models import ChatMessage, ChatSession

import os
OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434/api/chat')
OLLAMA_MODEL = 'llama3.2'
MAX_ITEMS = 5

NO_INFO = "I don't have information about that in the LebanonAI database."
NO_INFO_START = re.compile(r"\s*i\s+(do\s+not|don't|dont)\s+have\s+(any\s+)?(specific\s+)?information", re.I)
UNAVAILABLE = 'Sorry, the AI service is currently unavailable. Please try again in a moment.'
GREETING_REPLY = ('Marhaba! I answer questions using the LebanonAI listings: hotels, restaurants, '
                  'places, activities, offers and hiking routes. What would you like to know?')
SAMPLE_NOTE = 'Note: offers marked SAMPLE are demo examples, not real discounts.'

GREETINGS = {'hi', 'hello', 'hey', 'marhaba', 'salam', 'bonjour', 'hola', 'thanks', 'thank', 'you', 'ok', 'okay'}

STOPWORDS = set(
    "the and for with what where which who when how can could would should you your are was were any "
    "there this that these those about tell show give list find want need please recommend suggest best "
    "good nice great top near nearby visit see have has does doe from into than then too very much many "
    "more most also all one our their them its lebanon lebanese will might may let know like looking look "
    "get got say said ask asked name names info information details thing things way ways".split()
)

TYPE_WORDS = {
    'hotel': ('hotel',), 'resort': ('hotel',), 'stay': ('hotel',), 'accommodation': ('hotel',), 'sleep': ('hotel',),
    'restaurant': ('restaurant',), 'food': ('restaurant',), 'eat': ('restaurant',), 'dinner': ('restaurant',),
    'lunch': ('restaurant',), 'cuisine': ('restaurant',),
    'place': ('place',), 'site': ('place',), 'attraction': ('place',), 'museum': ('place',),
    'ruin': ('place',), 'castle': ('place',),
    'activity': ('activity',), 'tour': ('activity',), 'adventure': ('activity',),
    'hike': ('route', 'activity'), 'hiking': ('route', 'activity'), 'trail': ('route',),
    'route': ('route',), 'trek': ('route',),
    'offer': ('offer',), 'deal': ('offer',), 'discount': ('offer',),
}

ACCESS_WORDS = {'wheelchair', 'accessible', 'accessibility', 'disabled', 'disability',
                'mobility', 'handicap', 'handicapped'}
ACCESS_FACT = {
    'accessible': 'accessibility: FULL (wheelchair accessible)',
    'partial': 'accessibility: PARTIAL (only partly accessible)',
    'not_accessible': 'accessibility: NONE (not accessible)',
}
ACCESS_TAG = {
    'accessible': 'accessibility access mobility wheelchair accessible',
    'partial': 'accessibility access mobility wheelchair accessible',
}

SEGMENT_HINTS = {
    'student': 'The user is a student. Prefer lower prices and mention student offers if they appear in the FACTS.',
    'retired': ('The user is retired. Prefer places marked wheelchair accessible or partly accessible, and '
                'mention offers for retired people if they appear in the FACTS. Give no medical advice.'),
    'tourist': 'The user is a tourist. Give a short, practical answer.',
}

SYSTEM_PROMPT = (
    'You are the LebanonAI assistant for visitors to Lebanon.\n'
    'RULES:\n'
    '1. Use ONLY the FACTS given by the user message. Do not use any outside knowledge. '
    'Never write the word FACTS in your answer.\n'
    '2. Mention only places, offers and routes that appear in the FACTS.\n'
    '3. Never invent prices, phone numbers, opening hours, distances, ratings or accessibility. '
    'If a detail is not in the FACTS, say it is not listed. '
    'Report accessibility exactly as written in the FACTS (FULL or PARTIAL).\n'
    '4. If the FACTS do not answer the question, reply exactly: ' + NO_INFO + '\n'
    '5. When the question asks for a list, list every matching item from the FACTS, one per line, '
    'with its name and one key detail.\n'
    '6. Answer in English in at most 120 words. Offers marked SAMPLE are demo examples, so say that.'
)


def norm(s):
    s = unicodedata.normalize('NFKD', s or '')
    return ''.join(c for c in s if not unicodedata.combining(c)).lower()


def stem(w):
    if w.endswith('ies') and len(w) > 4:
        return w[:-3] + 'y'
    if w.endswith('s') and not w.endswith('ss') and len(w) > 3:
        return w[:-1]
    return w


def tokens(text):
    out = set()
    for raw in re.findall(r'[a-z]+', norm(text)):
        w = stem(raw)
        if len(w) >= 3 and raw not in STOPWORDS and w not in STOPWORDS:
            out.add(w)
    return out


def clean_answer(text):
    # The model must not show internal prompt wording to the user.
    text = re.sub(r'\bthe FACTS\b', 'the LebanonAI data', text, flags=re.I)
    text = re.sub(r'\bFACTS\b', 'the LebanonAI data', text)
    return text


def access_fact(value):
    return ACCESS_FACT.get(value, 'accessibility: not listed')


def make_item(kind, name, region_text, tag_text, desc, parts, access='', alias=''):
    short = (desc or '').strip()
    if len(short) > 110:
        short = short[:110].rsplit(' ', 1)[0] + '...'
    line = '- [%s] %s | %s' % (kind, name, ' | '.join(p for p in parts if p))
    if short:
        line += ' | about: ' + short
    return {
        'kind': kind, 'name': name, 'line': line, 'access': access,
        'name_t': tokens(name), 'region_t': tokens(region_text),
        'tag_t': tokens(tag_text), 'desc_t': tokens(desc), 'alias_t': tokens(alias),
    }


def build_items(segment):
    items = []

    for h in Hotel.objects.all():
        items.append(make_item(
            'hotel', h.name, h.location + ' ' + h.governorate,
            'star hotel ' + ACCESS_TAG.get(h.accessibility, ''), h.description,
            ['region: ' + h.governorate, 'location: ' + h.location, '%s stars' % h.stars,
             'price level %s (more $ means more expensive)' % h.price_range, access_fact(h.accessibility)],
            access=h.accessibility))

    for r in Restaurant.objects.all():
        veg = 'vegetarian friendly' if r.is_vegetarian else ''
        items.append(make_item(
            'restaurant', r.name, r.location + ' ' + r.governorate,
            r.cuisine_type + ' restaurant ' + veg + ' ' + ACCESS_TAG.get(r.accessibility, ''), r.description,
            ['region: ' + r.governorate, 'location: ' + r.location, 'cuisine: ' + r.cuisine_type,
             'price level %s (more $ means more expensive)' % r.price_range, veg, access_fact(r.accessibility)],
            access=r.accessibility))

    for p in Place.objects.all():
        if p.entrance_fee is None:
            fee = 'entrance fee not listed'
        elif p.entrance_fee == 0:
            fee = 'free entrance'
        else:
            fee = 'entrance fee $%s' % p.entrance_fee
        items.append(make_item(
            'place', p.name, p.governorate, p.category + ' place ' + ACCESS_TAG.get(p.accessibility, ''),
            p.description,
            ['region: ' + p.governorate, 'category: ' + p.category, fee,
             ('hours: ' + p.opening_hours) if p.opening_hours else '', access_fact(p.accessibility)],
            access=p.accessibility))

    for a in Activity.objects.all():
        price = 'free' if a.price == 0 else 'price $%s' % a.price
        items.append(make_item(
            'activity', a.name, a.location + ' ' + a.governorate,
            a.get_type_display() + ' activity tour ' + ACCESS_TAG.get(a.accessibility, ''), a.description,
            ['region: ' + a.governorate, 'location: ' + a.location, 'type: ' + a.get_type_display(), price,
             ('duration: ' + a.duration) if a.duration else '', access_fact(a.accessibility)],
            access=a.accessibility))

    for r in HikingRoute.objects.filter(is_active=True):
        diff = r.get_difficulty_display().lower()
        items.append(make_item(
            'route', r.name, r.region, 'hiking trail route ' + diff, r.description,
            ['region: ' + r.region, '%.1f km' % r.distance_km, 'difficulty: ' + diff]))

    today = timezone.localdate()
    segments = ['all'] + ([segment] if segment else [])
    offers = (Offer.objects
              .filter(is_active=True, segment__in=segments, valid_from__lte=today)
              .filter(Q(valid_to__isnull=True) | Q(valid_to__gte=today)))
    for o in offers:
        ln = OfferSerializer(o).data.get('listing_name') or ''
        items.append(make_item(
            'offer', o.title, ln, o.segment + ' offer deal discount', o.description,
            ['for: ' + o.get_segment_display(), o.discount_text,
             ('applies at: ' + ln) if ln else '',
             ('valid until ' + str(o.valid_to)) if o.valid_to else ''],
            alias=ln))

    return items


def retrieve(message, segment):
    qtokens = tokens(message)
    if not qtokens:
        return []
    type_tokens = {t for t in qtokens if t in TYPE_WORDS}
    qkinds = set()
    for t in type_tokens:
        qkinds.update(TYPE_WORDS[t])
    # A question like "hotels in Tokyo" needs the place to match, not only the type.
    content = qtokens - type_tokens
    if not content:
        content = set(qtokens)
    access_q = bool(qtokens & ACCESS_WORDS)

    scored = []
    for it in build_items(segment):
        if qkinds and it['kind'] not in qkinds:
            continue
        if access_q and it['access'] not in ('accessible', 'partial'):
            continue
        s = 0
        for t in content:
            if t in it['name_t']:
                s += 3
            elif t in it['region_t'] or t in it['tag_t']:
                s += 2
            elif t in it['desc_t']:
                s += 1
        if it['kind'] == 'offer' and 'offer' in qkinds:
            s = max(s, 1)
        if s > 0:
            scored.append((s, it))
    scored.sort(key=lambda x: -x[0])
    return [it for _, it in scored[:MAX_ITEMS]]


def used_sources(answer, items):
    a = tokens(answer)
    out = []
    for it in items:
        nt = it['name_t'] - {'sample'}
        by_name = bool(nt) and nt <= a
        by_alias = it['kind'] == 'offer' and bool(it['alias_t']) and it['alias_t'] <= a
        if by_name or by_alias:
            out.append(it['name'])
    return out or [i['name'] for i in items[:3]]


def get_segment(request):
    # Only the segment is used. Health data is never sent to the model (NFR-06).
    try:
        result = JWTAuthentication().authenticate(request)
    except Exception:
        return None
    if not result:
        return None
    profile = getattr(result[0], 'profile', None)
    return profile.segment if profile else None


def ask_model(message, items, segment):
    facts = '\n'.join(i['line'] for i in items)
    hint = SEGMENT_HINTS.get(segment, '')
    user_prompt = 'FACTS:\n%s\n\n%s\n\nQUESTION: %s' % (facts, hint, message)
    try:
        resp = requests.post(OLLAMA_URL, json={
            'model': OLLAMA_MODEL,
            'messages': [
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_prompt},
            ],
            'stream': False,
            'options': {'temperature': 0.1, 'num_predict': 160, 'num_ctx': 2048},
            'keep_alive': '30m',
        }, timeout=90)
        resp.raise_for_status()
        text = resp.json()['message']['content'].strip()
        return (text or NO_INFO), True
    except (requests.exceptions.RequestException, KeyError, ValueError):
        return UNAVAILABLE, False


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def chat(request):
    message = str(request.data.get('message', '')).strip()[:500]
    session_id = request.data.get('session_id', None)

    if not message:
        return Response({'error': 'No message provided'}, status=400)

    session = None
    if session_id:
        try:
            session = ChatSession.objects.filter(id=session_id).first()
        except (ValueError, TypeError):
            session = None
    if session is None:
        session = ChatSession.objects.create()

    ChatMessage.objects.create(session=session, role='user', content=message)

    segment = get_segment(request)
    sources = []
    grounded = False

    words = set(re.findall(r'[a-z]+', norm(message)))
    if words and words <= GREETINGS:
        ai_response = GREETING_REPLY
    else:
        items = retrieve(message, segment)
        if not items:
            ai_response = NO_INFO
        else:
            ai_response, ok = ask_model(message, items, segment)
            if ok and NO_INFO_START.match(ai_response):
                ai_response = NO_INFO
            elif ok and NO_INFO.lower() not in ai_response.lower():
                ai_response = clean_answer(ai_response)
                sources = used_sources(ai_response, items)
                grounded = True
                used_sample = any(i['kind'] == 'offer' and i['name'] in sources and
                                  i['name'].upper().startswith('SAMPLE') for i in items)
                if used_sample:
                    ai_response = ai_response.rstrip() + '\n\n' + SAMPLE_NOTE

    ChatMessage.objects.create(session=session, role='assistant', content=ai_response)

    return Response({
        'session_id': session.id,
        'message': ai_response,
        'sources': sources,
        'grounded': grounded,
    })
