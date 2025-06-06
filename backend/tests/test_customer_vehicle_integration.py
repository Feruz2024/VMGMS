from django.test import TestCase
from users.models import User
from customers.models import Customer
from vehicles.models import Vehicle
from rest_framework.test import APIClient
from django.urls import reverse

class CustomerVehicleIntegrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        from django.contrib.auth.models import Group
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.client.force_authenticate(user=self.admin)

    def test_create_customer_and_vehicle(self):
        # Create customer via API
        customer_data = {
            'name': 'Integration User',
            'primary_phone': '5551234567',
            'email': 'integration@example.com'
        }
        customer_url = reverse('customer-list')
        customer_response = self.client.post(customer_url, customer_data)
        self.assertEqual(customer_response.status_code, 201)
        customer_id = customer_response.data['id']

        # Create vehicle for this customer via API
        vehicle_data = {
            'customer': customer_id,
            'make': 'Ford',
            'model': 'Fusion',
            'year': 2022,
            'vin': '5HGCM82633A004352',
            'license_plate': 'INTEG123',
        }
        vehicle_url = reverse('vehicle-list')
        vehicle_response = self.client.post(vehicle_url, vehicle_data)
        self.assertEqual(vehicle_response.status_code, 201)
        self.assertEqual(vehicle_response.data['customer'], customer_id)

        # Retrieve customer detail and check vehicle association
        customer_detail_url = reverse('customer-detail', args=[customer_id])
        customer_detail_response = self.client.get(customer_detail_url)
        self.assertEqual(customer_detail_response.status_code, 200)
        # Optionally, check for vehicles in the response if nested serialization is implemented
