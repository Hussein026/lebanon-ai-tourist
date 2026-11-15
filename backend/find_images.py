import html, json, re, time, unicodedata, urllib.parse, urllib.request
from hotels.models import Hotel
from restaurants.models import Restaurant
from places.models import Place
from activities.models import Activity
API = 'https://commons.wikimedia.org/w/api.php'
HEADERS = {'User-Agent': 'LebanonAI-student-project/1.0 (https://github.com/Hussein026/lebanon-ai-tourist)'}
GENERIC = {'hotel', 'restaurant', 'beirut', 'lebanon', 'lebanese', 'tour', 'the', 'and', 'of', 'de', 'du', 'resort'}
def norm(s):
    s = unicodedata.normalize('NFKD', s)
    return ''.join(c for c in s if not unicodedata.combining(c)).lower()
def keywords(name):
    words = re.findall(r'[A-Za-z\u00C0-\u00FF]+', norm(name))
    return [w for w in words if len(w) >= 3 and w not in GENERIC]
def strip_tags(s):
    return re.sub(r'<[^>]+>', '', s or '').strip()
def search(q):
    params = {
        'action': 'query', 'generator': 'search', 'gsrnamespace': '6',
        'gsrsearch': q, 'gsrlimit': '8', 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata', 'iiurlwidth': '800', 'format': 'json',
    }
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)
    pages = data.get('query', {}).get('pages', {})
    out = []
    for p in sorted(pages.values(), key=lambda x: x.get('index', 999)):
        title = p.get('title', '')
        if not title.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        info = (p.get('imageinfo') or [{}])[0]
        meta = info.get('extmetadata', {})
        out.append({
            'title': title,
            'image_url': info.get('thumburl') or info.get('url', ''),
            'page': info.get('descriptionurl', ''),
            'license': strip_tags(meta.get('LicenseShortName', {}).get('value', '')),
            'author': strip_tags(meta.get('Artist', {}).get('value', '')),
        })
    return out
def find(name):
    kws = keywords(name)
    for q in (name + ' Lebanon', name):
        try:
            results = search(q)
        except Exception as e:
            print('   error:', e)
            results = []
        for r in results:
            t = norm(r['title'])
            if not kws or any(k in t for k in kws):
                return r
        time.sleep(1)
    return None
groups = [('hotels', Hotel), ('restaurants', Restaurant), ('places', Place), ('activities', Activity)]
rows = []
total = 0
for key, Model in groups:
    for obj in Model.objects.all().order_by('id'):
        total += 1
        if obj.image_url:
            print('[has photo] ', key, obj.id, obj.name)
            continue
        r = find(obj.name)
        row = {'model': key, 'id': obj.id, 'name': obj.name, 'found': bool(r)}
        if r:
            row.update(r)
        rows.append(row)
        print('[found]    ' if r else '[none]     ', key, obj.id, obj.name)
        time.sleep(1)
found = [r for r in rows if r['found']]
with open('image_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(found, f, ensure_ascii=False, indent=2)
cards = []
for r in rows:
    if r['found']:
        cards.append(
            '<div class="c"><img src="%s"><b>%s</b> (%s #%s)<br>File: %s<br>Licence: %s<br>Author: %s<br><a href="%s" target="_blank">Commons page</a></div>' % (
                html.escape(r['image_url']), html.escape(r['name']), r['model'], r['id'],
                html.escape(r['title']), html.escape(r['license']),
                html.escape(r['author'][:80]), html.escape(r['page'])))
    else:
        cards.append('<div class="c none"><b>%s</b> (%s #%s)<br>No free photo found</div>' % (
            html.escape(r['name']), r['model'], r['id']))
page = ('<html><head><meta charset="utf-8"><title>Image candidates</title><style>'
        'body{background:#1a1a2e;color:#fff;font-family:Arial;padding:20px}'
        '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}'
        '.c{background:#16213e;border-radius:12px;padding:14px;font-size:13px;line-height:1.5}'
        '.c img{width:100%;height:180px;object-fit:cover;border-radius:8px;display:block;margin-bottom:8px}'
        '.none{color:#a8b2d8}a{color:#f5a623}</style></head><body>'
        '<h2>Photo candidates: check each one is the right place</h2><div class="g">'
        + ''.join(cards) + '</div></body></html>')
with open('image_candidates.html', 'w', encoding='utf-8') as f:
    f.write(page)
print('')
print('Listings: %d | already have photo: %d | candidates found: %d | none: %d' % (
    total, total - len(rows), len(found), len(rows) - len(found)))
