from django.test import TestCase
from customers.models import Customer
from vehicles.models import Vehicle
from users.models import User
from .models import Appointment
from datetime import datetime, timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from customers.models import Customer
from vehicles.models import Vehicle
from .models import Appointment
from datetime import timedelta
from django.utils import timezone

class AppointmentModelTest(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Test Customer",
            primary_phone="1234567890",
            email="apptest@example.com"
        )
        self.vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Toyota",
            model="Corolla",
            year=2020,
            vin="1HGCM82633A004352",
            license_plate="APPT123",
        )
        self.technician = User.objects.create_user(username='tech', password='techpass')

    def test_create_appointment_success(self):
        appt = Appointment.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            technician=self.technician,
            appointment_time=timezone.now() + timedelta(days=1),
            reason="Oil change"
        )
        self.assertEqual(appt.status, 'Booked')
        self.assertEqual(appt.customer, self.customer)
        self.assertEqual(appt.vehicle, self.vehicle)
        self.assertEqual(appt.technician, self.technician)

    def test_required_fields(self):
        with self.assertRaises(Exception):
            Appointment.objects.create(
                customer=None,
                vehicle=None,
                appointment_time=None,
                reason=""
            )

class AppointmentAPITest(TestCase):
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
            email="apptapi@example.com"
        )
        self.vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Toyota",
            model="Corolla",
            year=2020,
            vin="1HGCM82633A004359",
            license_plate="APITEST123",
        )
        self.technician = User.objects.create_user(username='tech', password='techpass')

    def test_create_appointment(self):
        url = reverse('appointment-list')
        data = {
            'customer': self.customer.id,
            'vehicle': self.vehicle.id,
            'technician': self.technician.id,
            'appointment_time': (timezone.now() + timedelta(days=1)).isoformat(),
            'reason': 'Brake inspection',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_required_fields(self):
        url = reverse('appointment-list')
        data = {
            'customer': '',
            'vehicle': '',
            'appointment_time': '',
            'reason': '',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_soft_delete(self):
        appt = Appointment.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            technician=self.technician,
            appointment_time=timezone.now() + timedelta(days=2),
            reason="Tire rotation"
        )
        url = reverse('appointment-detail', args=[appt.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        appt.refresh_from_db()
        self.assertEqual(appt.status, 'Cancelled')
