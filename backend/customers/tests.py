from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import Group
from users.models import User
from .models import Customer

class CustomerModelTest(TestCase):
    def test_create_customer_success(self):
        customer = Customer.objects.create(
            name="John Doe",
            address="123 Main St",
            primary_phone="1234567890",
            secondary_phone="0987654321",
            email="john@example.com"
        )
        self.assertEqual(customer.name, "John Doe")
        self.assertEqual(customer.primary_phone, "1234567890")
        self.assertEqual(customer.email, "john@example.com")
        self.assertTrue(customer.is_active)

    def test_email_uniqueness(self):
        Customer.objects.create(
            name="Jane Doe",
            primary_phone="1112223333",
            email="jane@example.com"
        )
        with self.assertRaises(Exception):
            Customer.objects.create(
                name="Jane Smith",
                primary_phone="4445556666",
                email="jane@example.com"
            )

    def test_required_fields(self):
        customer = Customer(
            name="",
            primary_phone="",
            email=""
        )
        with self.assertRaises(Exception):
            customer.full_clean()
            customer.save()

class CustomerAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.client.force_authenticate(user=self.admin)

    def test_create_customer(self):
        url = reverse('customer-list')
        data = {
            'name': 'Alice',
            'primary_phone': '1234567890',
            'email': 'alice@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Customer.objects.count(), 1)

    def test_email_uniqueness(self):
        Customer.objects.create(name='Bob', primary_phone='111', email='bob@example.com')
        url = reverse('customer-list')
        data = {
            'name': 'Bob2',
            'primary_phone': '222',
            'email': 'bob@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_soft_delete(self):
        customer = Customer.objects.create(name='Del', primary_phone='333', email='del@example.com')
        url = reverse('customer-detail', args=[customer.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        customer.refresh_from_db()
        self.assertFalse(customer.is_active)
