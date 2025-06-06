from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'address', 'primary_phone', 'secondary_phone', 'email', 'is_active', 'created_at', 'updated_at'
        ]

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_primary_phone(self, value):
        if not value:
            raise serializers.ValidationError("Primary phone is required.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if Customer.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A customer with this email already exists.")
        return value
