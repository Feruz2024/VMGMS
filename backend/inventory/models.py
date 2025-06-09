from django.db import models
from users.models import User

class Part(models.Model):
    part_number = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_on_hand = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.part_number} - {self.description}"

class StockAdjustmentLog(models.Model):
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='adjustments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    adjustment_amount = models.IntegerField()
    new_qoh = models.IntegerField()
    reason = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.part.part_number} adj {self.adjustment_amount} by {self.user} on {self.timestamp}"
