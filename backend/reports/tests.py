from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from django.contrib.auth.models import Group
from billing.models import Invoice
from decimal import Decimal
from rest_framework_simplejwt.tokens import RefreshToken

class SalesReportAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.admin.save()
        self.admin = User.objects.get(username='admin')
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        from customers.models import Customer
        from vehicles.models import Vehicle
        from workorders.models import WorkOrder
        self.customer = Customer.objects.create(name='Test Customer', primary_phone='1234567890', email='test@example.com')
        self.vehicle = Vehicle.objects.create(customer=self.customer, make='Toyota', model='Corolla', year=2020, vin='1HGCM82633A004352', license_plate='ABC123')
        wo1 = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='Completed')
        wo2 = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='Completed')
        wo3 = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='Completed')
        Invoice.objects.create(workorder=wo1, total=100, status='Paid')
        Invoice.objects.create(workorder=wo2, total=200, status='Paid')
        Invoice.objects.create(workorder=wo3, total=50, status='Draft')

    def test_sales_report(self):
        url = reverse('sales-report')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_sales'], Decimal('300'))
        self.assertEqual(response.data['invoice_count'], 2)

class WorkOrderStatusReportAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.admin.save()
        self.admin = User.objects.get(username='admin')
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        from customers.models import Customer
        from vehicles.models import Vehicle
        from workorders.models import WorkOrder
        self.customer = Customer.objects.create(name='Test Customer', primary_phone='1234567890', email='test2@example.com')
        self.vehicle = Vehicle.objects.create(customer=self.customer, make='Honda', model='Civic', year=2021, vin='2HGCM82633A004353', license_plate='XYZ789')
        self.wo1 = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='Completed')
        self.wo2 = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='In Progress')

    def test_workorder_status_report(self):
        url = reverse('workorder-status-report')
        response = self.client.get(url, {'status': 'Completed'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['status'], 'Completed')

from inventory.models import Part

# Inventory Level Report Test
class InventoryLevelReportAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.admin.save()
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        # Create parts
        self.part1 = Part.objects.create(part_number='P001', description='Oil Filter', selling_price=10, cost_price=5, quantity_on_hand=3)
        self.part2 = Part.objects.create(part_number='P002', description='Air Filter', selling_price=15, cost_price=7, quantity_on_hand=10)
        self.part3 = Part.objects.create(part_number='P003', description='Brake Pad', selling_price=30, cost_price=15, quantity_on_hand=5)

    def test_inventory_level_report_default_threshold(self):
        url = reverse('inventory-level-report')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Default threshold is 5, so part1 and part3 should be included
        part_numbers = [p['part_number'] for p in response.data['results']]
        self.assertIn('P001', part_numbers)
        self.assertIn('P003', part_numbers)
        self.assertNotIn('P002', part_numbers)
        self.assertEqual(response.data['count'], 2)

    def test_inventory_level_report_custom_threshold(self):
        url = reverse('inventory-level-report')
        response = self.client.get(url, {'threshold': 10})
        self.assertEqual(response.status_code, 200)
        # All parts should be included
        part_numbers = [p['part_number'] for p in response.data['results']]
        self.assertIn('P001', part_numbers)
        self.assertIn('P002', part_numbers)
        self.assertIn('P003', part_numbers)
        self.assertEqual(response.data['count'], 3)
