import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vmgms_backend.settings')
django.setup()

from services.models import Service

Service.objects.all().delete()
print('All Service records deleted.')
