import csv, json, os
from places.models import Place
data = json.load(open('image_candidates.json', encoding='utf-8'))
rows = []
for c in data:
    if c['model'] != 'places':
        continue
    p = Place.objects.filter(id=c['id'], name=c['name']).first()
    if not p:
        print('skip', c['name'])
        continue
    if p.image_url:
        print('already has photo:', p.name)
        continue
    p.image_url = c['image_url']
    p.save(update_fields=['image_url'])
    rows.append([p.name, c['image_url'], c['title'], c['license'], c['author'], c['page']])
    print('saved', p.id, p.name)
os.makedirs(r'D:\lebanon-ai-tourist\docs', exist_ok=True)
path = r'D:\lebanon-ai-tourist\docs\image_credits.csv'
is_new = not os.path.exists(path)
with open(path, 'a', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    if is_new:
        w.writerow(['listing', 'image_url', 'commons_file', 'licence', 'author', 'commons_page'])
    w.writerows(rows)
print(len(rows), 'photos saved. Credits file:', path)
