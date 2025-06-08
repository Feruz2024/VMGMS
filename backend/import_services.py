import csv
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vmgms_backend.settings')
django.setup()

from services.models import Service

csv_path = r'C:\Users\Fera\Documents\list of services.csv'

with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    count = 0
    for row in reader:
        category = row['System Category'].strip()
        name = row['Service'].strip()
        if not Service.objects.filter(name=name, category=category).exists():
            Service.objects.create(
                name=name,
                category=category,
                description='',
                default_hours=1,
                default_rate=100
            )
            count += 1
print('Imported {} services.'.format(count))
