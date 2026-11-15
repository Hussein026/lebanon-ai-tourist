import csv, json, os
from activities.models import Activity
CHOICES = {1: 2, 2: 2, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1}
data = json.load(open('activity_candidates.json', encoding='utf-8'))
rows = []
for act_id, opt in CHOICES.items():
    c = next((x for x in data if x['id'] == act_id and x['option'] == opt), None)
    a = Activity.objects.filter(id=act_id).first()
    if not a or not c:
        print('skip', act_id, '(no such option)')
        continue
    if a.image_url:
        print('already has photo:', a.name)
        continue
    a.image_url = c['image_url']
    a.save(update_fields=['image_url'])
    rows.append([a.name, c['image_url'], c['title'], c['license'], c['author'], c['page']])
    print('saved', a.id, a.name)
os.makedirs(r'D:\lebanon-ai-tourist\docs', exist_ok=True)
path = r'D:\lebanon-ai-tourist\docs\image_credits.csv'
is_new = not os.path.exists(path)
with open(path, 'a', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    if is_new:
        w.writerow(['listing', 'image_url', 'commons_file', 'licence', 'author', 'commons_page'])
    w.writerows(rows)
print(len(rows), 'photos saved.')
