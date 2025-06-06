from django.test import TestCase
from customers.models import Customer
from vehicles.models import Vehicle
from users.models import User
from .models import WorkOrder, WorkOrderItem
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class WorkOrderModelTest(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="WO Customer",
            primary_phone="1234567890",
            email="wo@example.com"
        )
        self.vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Honda",
            model="Civic",
            year=2021,
            vin="1HGCM82633A004360",
            license_plate="WO123",
        )
        self.technician = User.objects.create_user(username='tech', password='techpass')

    def test_create_workorder_success(self):
        wo = WorkOrder.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            technician=self.technician,
            customer_complaint="Engine noise"
        )
        self.assertEqual(wo.status, 'New')
        self.assertEqual(wo.customer, self.customer)
        self.assertEqual(wo.vehicle, self.vehicle)
        self.assertEqual(wo.technician, self.technician)

    def test_required_fields(self):
        with self.assertRaises(Exception):
            WorkOrder.objects.create(
                customer=None,
                vehicle=None,
                customer_complaint=""
            )

class WorkOrderItemModelTest(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="WOI Customer",
            primary_phone="1234567890",
            email="woi@example.com"
        )
        self.vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Ford",
            model="Focus",
            year=2022,
            vin="1HGCM82633A004361",
            license_plate="WOI123",
        )
        self.wo = WorkOrder.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            customer_complaint="Brake issue"
        )

    def test_create_workorderitem_success(self):
        item = WorkOrderItem.objects.create(
            work_order=self.wo,
            item_type='LABOR',
            description="Replace brake pads",
            quantity=2,
            unit_price=50.00
        )
        self.assertEqual(item.work_order, self.wo)
        self.assertEqual(item.item_type, 'LABOR')
        self.assertEqual(item.description, "Replace brake pads")

    def test_required_fields(self):
        with self.assertRaises(Exception):
            WorkOrderItem.objects.create(
                work_order=None,
                item_type='',
                description='',
                quantity=None,
                unit_price=None
            )

class WorkOrderAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        from django.contrib.auth.models import Group
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.client.force_authenticate(user=self.admin)
        self.customer = Customer.objects.create(
            name="WO API Customer",
            primary_phone="1234567890",
            email="woapi@example.com"
        )
        self.vehicle = Vehicle.objects.create(
            customer=self.customer,
            make="Nissan",
            model="Altima",
            year=2023,
            vin="1HGCM82633A004362",
            license_plate="WOAPI123",
        )
        self.technician = User.objects.create_user(username='tech', password='techpass')

    def test_create_workorder(self):
        url = reverse('workorder-list')
        data = {
            'customer': self.customer.id,
            'vehicle': self.vehicle.id,
            'technician': self.technician.id,
            'customer_complaint': 'Strange noise',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WorkOrder.objects.count(), 1)

    def test_add_workorder_item(self):
        wo = WorkOrder.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            technician=self.technician,
            customer_complaint="Flat tire"
        )
        url = reverse('workorderitem-list')
        data = {
            'work_order': wo.id,
            'item_type': 'PART',
            'description': 'Tire',
            'quantity': 1,
            'unit_price': 100.00
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WorkOrderItem.objects.count(), 1)

    def test_soft_delete_workorder(self):
        wo = WorkOrder.objects.create(
            customer=self.customer,
            vehicle=self.vehicle,
            technician=self.technician,
            customer_complaint="Battery issue"
        )
        url = reverse('workorder-detail', args=[wo.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        wo.refresh_from_db()
        self.assertEqual(wo.status, 'Cancelled')
