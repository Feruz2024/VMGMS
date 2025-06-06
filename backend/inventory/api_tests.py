from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User
from .models import Part, StockAdjustmentLog

class PartAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.groups.create(name='Admin')
        self.part_data = {
            'part_number': 'P9999',
            'description': 'Test Part',
            'selling_price': 100.0,
            'cost_price': 50.0,
            'quantity_on_hand': 10
        }
        self.client.login(username='admin', password='adminpass')

    def test_create_part(self):
        url = reverse('part-list')
        response = self.client.post(url, self.part_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Part.objects.count(), 1)

    def test_list_parts(self):
        Part.objects.create(**self.part_data)
        url = reverse('part-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

class StockAdjustmentLogAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        self.admin.groups.create(name='Admin')
        self.part = Part.objects.create(
            part_number='P8888',
            description='Adj Part',
            selling_price=20.0,
            cost_price=10.0,
            quantity_on_hand=5
        )
        self.log_data = {
            'part': self.part.id,
            'user': self.admin.id,
            'adjustment_amount': 5,
            'new_qoh': 10,
            'reason': 'Restock'
        }
        self.client.login(username='admin', password='adminpass')

    def test_create_stock_adjustment_log(self):
        url = reverse('stockadjustmentlog-list')
        response = self.client.post(url, self.log_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(StockAdjustmentLog.objects.count(), 1)

    def test_list_stock_adjustment_logs(self):
        StockAdjustmentLog.objects.create(part=self.part, user=self.admin, adjustment_amount=5, new_qoh=10, reason='Restock')
        url = reverse('stockadjustmentlog-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)
