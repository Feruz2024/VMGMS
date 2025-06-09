from django.db import models

from customers.models import Customer
from vehicles.models import Vehicle
from users.models import User
from services.models import Service

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Booked', 'Booked'),
        ('Confirmed', 'Confirmed'),
        ('Arrived', 'Arrived'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('No-Show', 'No-Show'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='appointments')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='appointments')
    technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    appointment_time = models.DateTimeField()
    services = models.ManyToManyField(Service, related_name='appointments', blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='Booked')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer.name} - {self.vehicle.license_plate} @ {self.appointment_time}"
