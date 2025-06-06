from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from users.models import User
from .models import Service

class ServiceAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='adminpass')
        from django.contrib.auth.models import Group
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        self.admin.groups.add(admin_group)
        self.client.force_authenticate(user=self.admin)

    def test_create_service(self):
        url = reverse('service-list')
        data = {
            'name': 'Alignment',
            'description': 'Wheel alignment',
            'default_hours': 1.5,
            'default_rate': 80.00
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Service.objects.count(), 1)

    def test_required_fields(self):
        url = reverse('service-list')
        data = {
            'name': '',
            'default_hours': '',
            'default_rate': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
