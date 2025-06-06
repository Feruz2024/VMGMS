from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model for VMGMS. Extends Django's AbstractUser.
    Additional fields can be added here as needed.
    """
    # Example: phone_number = models.CharField(max_length=20, blank=True, null=True)
    pass
