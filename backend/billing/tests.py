from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from workorders.models import WorkOrder, WorkOrderItem
from billing.models import Invoice, Payment
from inventory.models import Part
from decimal import Decimal

class BillingAPITest(APITestCase):
    def test_jwt_auth_works(self):
        url = reverse('customer-list')
        response = self.client.get(url)
        self.assertNotEqual(response.status_code, 401)
    def setUp(self):
        from rest_framework_simplejwt.tokens import RefreshToken
        from django.contrib.auth.models import Group
        from customers.models import Customer
        from vehicles.models import Vehicle
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.admin.save()
        # Re-fetch user from DB to ensure all relations are set
        from users.models import User as UserModel
        self.admin = UserModel.objects.get(username='admin')
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        self.part = Part.objects.create(part_number='P100', description='Test Part', selling_price=100, cost_price=50, quantity_on_hand=10)
        self.customer = Customer.objects.create(name='Test Customer', primary_phone='1234567890', email='test@example.com')
        self.vehicle = Vehicle.objects.create(customer=self.customer, make='Toyota', model='Corolla', year=2020, vin='1HGCM82633A004352', license_plate='ABC123')
        from workorders.models import WorkOrder
        self.wo = WorkOrder.objects.create(customer=self.customer, vehicle=self.vehicle, status='Completed')
        from workorders.models import WorkOrderItem
        self.item = WorkOrderItem.objects.create(work_order=self.wo, item_type='PART', description='Test Part', quantity=2, unit_price=100, catalog_part=self.part.id)

    def test_generate_invoice(self):
        url = reverse('invoice-generate')
        response = self.client.post(url, {'workOrderId': self.wo.id}, format='json')
        self.assertEqual(response.status_code, 201)
        invoice = Invoice.objects.get(workorder=self.wo)
        self.assertEqual(invoice.total, Decimal('217.00'))  # 2*100 + 8.5% tax
        self.wo.refresh_from_db()
        self.assertEqual(self.wo.status, 'Invoiced')

    def test_record_payment(self):
        # Generate invoice first
        invoice = Invoice.objects.create(workorder=self.wo, subtotal=200, tax_amount=17, total=217, status='Sent')
        url = reverse('payment-list')
        response = self.client.post(url, {'invoice': invoice.id, 'amount': 217, 'payment_method': 'Cash'}, format='json')
        self.assertEqual(response.status_code, 201)
        invoice.refresh_from_db()
        self.assertEqual(invoice.amount_paid, Decimal('217'))
        self.assertEqual(invoice.status, 'Paid')

    def test_partial_payment(self):
        invoice = Invoice.objects.create(workorder=self.wo, subtotal=200, tax_amount=17, total=217, status='Sent')
        url = reverse('payment-list')
        response = self.client.post(url, {'invoice': invoice.id, 'amount': 100, 'payment_method': 'Card'}, format='json')
        self.assertEqual(response.status_code, 201)
        invoice.refresh_from_db()
        self.assertEqual(invoice.amount_paid, Decimal('100'))
        self.assertEqual(invoice.status, 'Partially Paid')
