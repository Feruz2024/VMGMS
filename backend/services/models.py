from django.db import models

# Create your models here.


class Service(models.Model):
    category = models.CharField(max_length=100, db_index=True, null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    default_hours = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    default_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("name", "category")

    def __str__(self):
        return self.name
