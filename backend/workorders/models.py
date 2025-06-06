from django.db import models
from customers.models import Customer
from vehicles.models import Vehicle
from users.models import User

class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Diagnosis', 'Diagnosis'),
        ('Waiting Approval', 'Waiting Approval'),
        ('Waiting Parts', 'Waiting Parts'),
        ('In Progress', 'In Progress'),
        ('Ready for Pickup', 'Ready for Pickup'),
        ('Completed', 'Completed'),
        ('Invoiced', 'Invoiced'),
        ('Cancelled', 'Cancelled'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='workorders')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='workorders')
    technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='workorders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    customer_complaint = models.TextField()
    technician_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"WO#{self.id} - {self.customer.name} - {self.vehicle.license_plate}"

class WorkOrderItem(models.Model):
    ITEM_TYPE_CHOICES = [
        ('LABOR', 'Labor'),
        ('PART', 'Part'),
    ]
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='items')
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE_CHOICES)
    description = models.TextField()
    quantity = models.DecimalField(max_digits=7, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    # catalog_part and catalog_service are placeholders for future integration
    catalog_part = models.IntegerField(null=True, blank=True)
    catalog_service = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.item_type}: {self.description} (WO#{self.work_order.id})"
