import urllib.request, urllib.parse
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place
from activities.models import Activity
ok = bad = empty = 0
for key, M in [('hotels', Hotel), ('restaurants', Restaurant), ('places', Place), ('activities', Activity)]:
    for o in M.objects.all().order_by('id'):
        if not o.image_url:
            empty += 1
            print('EMPTY ', key, o.id, o.name)
            continue
        req = urllib.request.Request(o.image_url, headers={'User-Agent': 'Mozilla/5.0'})
        host = urllib.parse.urlparse(o.image_url).netloc
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                ctype = r.headers.get('Content-Type', '')
                if ctype.startswith('image/'):
                    ok += 1
                    print('OK    ', key, o.id, o.name, '|', host)
                else:
                    bad += 1
                    print('NOT IMAGE', key, o.id, o.name, '|', ctype)
        except Exception as e:
            bad += 1
            print('FAIL  ', key, o.id, o.name, '|', host, '|', e)
print('')
print('TOTAL 36 | OK: %d | FAIL: %d | EMPTY: %d' % (ok, bad, empty))
