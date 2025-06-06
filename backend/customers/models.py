from django.core.exceptions import ValidationError
from django.db import models

# Create your models here.

class Customer(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=500, blank=True)
    primary_phone = models.CharField(max_length=20)
    secondary_phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(max_length=254, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if not self.name:
            raise ValidationError({'name': 'Name is required.'})
        if not self.primary_phone:
            raise ValidationError({'primary_phone': 'Primary phone is required.'})
        if not self.email:
            raise ValidationError({'email': 'Email is required.'})

    def __str__(self):
        return f"{self.name} ({self.primary_phone})"
