import html, json, time, unicodedata, urllib.parse, urllib.request
from activities.models import Activity
API = 'https://commons.wikimedia.org/w/api.php'
HEADERS = {'User-Agent': 'LebanonAI-student-project/1.0 (https://github.com/Hussein026/lebanon-ai-tourist)'}
QUERIES = {
    1: 'Qadisha Valley Lebanon',
    2: 'The Cedars ski resort Lebanon',
    3: 'Jeita Grotto cave Lebanon',
    4: 'Baalbek temples Lebanon',
    5: 'Byblos harbour Lebanon',
    6: 'Gemmayzeh Beirut',
    7: 'Harissa telepherique Lebanon',
    8: 'Tyre beach Lebanon',
    9: 'Shouf Cedar Reserve Lebanon',
    10: 'Soap Museum Sidon Lebanon',
}
SKIP = ('map', 'logo', 'flag', 'coat of arms', 'diagram', 'plan', 'seal')
def strip_tags(s):
    import re
    return re.sub(r'<[^>]+>', '', s or '').strip()
def search(q):
    params = {
        'action': 'query', 'generator': 'search', 'gsrnamespace': '6',
        'gsrsearch': q, 'gsrlimit': '15', 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata', 'iiurlwidth': '800', 'format': 'json',
    }
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)
    pages = data.get('query', {}).get('pages', {})
    out = []
    for p in sorted(pages.values(), key=lambda x: x.get('index', 999)):
        title = p.get('title', '')
        low = title.lower()
        if not low.endswith(('.jpg', '.jpeg')):
            continue
        if any(w in low for w in SKIP):
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
        if len(out) == 3:
            break
    return out
result = []
sections = []
for a in Activity.objects.all().order_by('id'):
    q = QUERIES.get(a.id, a.name + ' Lebanon')
    try:
        opts = search(q)
    except Exception as e:
        print('error', a.id, e)
        opts = []
    cards = []
    for i, o in enumerate(opts, 1):
        result.append({'id': a.id, 'name': a.name, 'option': i, **o})
        cards.append(
            '<div class="c"><img src="%s"><b>Option %d</b><br>%s<br>Licence: %s<br>Author: %s<br><a href="%s" target="_blank">Commons page</a></div>' % (
                html.escape(o['image_url']), i, html.escape(o['title']),
                html.escape(o['license']), html.escape(o['author'][:70]), html.escape(o['page'])))
    if not cards:
        cards.append('<div class="c">No free photo found</div>')
    sections.append('<h3>#%d %s <small>(searched: %s)</small></h3><div class="g">%s</div>' % (
        a.id, html.escape(a.name), html.escape(q), ''.join(cards)))
    print('#%d %s: %d options' % (a.id, a.name, len(opts)))
    time.sleep(1)
with open('activity_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
page = ('<html><head><meta charset="utf-8"><title>Activity photo options</title><style>'
        'body{background:#1a1a2e;color:#fff;font-family:Arial;padding:20px}'
        'h3{color:#e94560;margin:28px 0 8px}small{color:#a8b2d8;font-weight:normal}'
        '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}'
        '.c{background:#16213e;border-radius:12px;padding:12px;font-size:13px;line-height:1.5}'
        '.c img{width:100%;height:170px;object-fit:cover;border-radius:8px;display:block;margin-bottom:8px}'
        'a{color:#f5a623}</style></head><body>'
        '<h2>Pick the best option for each activity (or none)</h2>' + ''.join(sections) + '</body></html>')
with open('activity_candidates.html', 'w', encoding='utf-8') as f:
    f.write(page)
print('Done. Options saved in activity_candidates.html')
