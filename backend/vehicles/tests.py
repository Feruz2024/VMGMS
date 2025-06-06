from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from customers.models import Customer
from .models import Vehicle

class VehicleModelTest(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Test Customer",
            primary_phone="1234567890",
            email="test@example.com"
        )

    def test_create_vehicle_success(self):
        vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Toyota",
            model="Corolla",
            year=2020,
            vin="1HGCM82633A004352",
            license_plate="ABC123",
        )
        self.assertEqual(vehicle.make, "Toyota")
        self.assertEqual(vehicle.vin, "1HGCM82633A004352")
        self.assertTrue(vehicle.is_active)

    def test_vin_uniqueness(self):
        Vehicle.objects.create(
            customer=self.customer,
            make="Honda",
            model="Civic",
            year=2021,
            vin="2HGCM82633A004352",
            license_plate="XYZ789",
        )
        with self.assertRaises(Exception):
            Vehicle.objects.create(
                customer=self.customer,
                make="Ford",
                model="Focus",
                year=2022,
                vin="2HGCM82633A004352",
                license_plate="LMN456",
            )

    def test_license_plate_uniqueness(self):
        Vehicle.objects.create(
            customer=self.customer,
            make="Mazda",
            model="3",
            year=2019,
            vin="3HGCM82633A004352",
            license_plate="PLT123",
        )
        with self.assertRaises(Exception):
            Vehicle.objects.create(
                customer=self.customer,
                make="Mazda",
                model="6",
                year=2018,
                vin="4HGCM82633A004352",
                license_plate="PLT123",
            )

    def test_required_fields(self):
        with self.assertRaises(Exception):
            Vehicle.objects.create(
                customer=self.customer,
                make="",
                model="",
                year=None,
                vin="",
                license_plate="",
            )

class VehicleAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        from django.contrib.auth.models import Group
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.client.force_authenticate(user=self.admin)
        self.customer = Customer.objects.create(
            name="Test Customer",
            primary_phone="1234567890",
            email="test@example.com"
        )

    def test_create_vehicle(self):
        url = reverse('vehicle-list')
        data = {
            'customer': self.customer.id,
            'make': 'Toyota',
            'model': 'Corolla',
            'year': 2020,
            'vin': '1HGCM82633A004352',
            'license_plate': 'ABC123',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehicle.objects.count(), 1)

    def test_vin_uniqueness(self):
        Vehicle.objects.create(
            customer=self.customer,
            make='Honda',
            model='Civic',
            year=2021,
            vin='2HGCM82633A004352',
            license_plate='XYZ789',
        )
        url = reverse('vehicle-list')
        data = {
            'customer': self.customer.id,
            'make': 'Ford',
            'model': 'Focus',
            'year': 2022,
            'vin': '2HGCM82633A004352',
            'license_plate': 'LMN456',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_soft_delete(self):
        vehicle = Vehicle.objects.create(
            customer=self.customer,
            make='Mazda',
            model='3',
            year=2019,
            vin='3HGCM82633A004352',
            license_plate='PLT123',
        )
        url = reverse('vehicle-detail', args=[vehicle.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        vehicle.refresh_from_db()
        self.assertFalse(vehicle.is_active)
