import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vmgms_backend.settings')
django.setup()

from customers.models import Customer
from vehicles.models import Vehicle

Customer.objects.all().delete()
Vehicle.objects.all().delete()
print('All Customer and Vehicle records deleted.')
