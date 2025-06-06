from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'id', 'customer', 'make', 'model', 'year', 'vin', 'license_plate', 'color', 'engine_size', 'notes', 'is_active', 'created_at', 'updated_at'
        ]

    def validate_make(self, value):
        if not value:
            raise serializers.ValidationError("Make is required.")
        return value

    def validate_model(self, value):
        if not value:
            raise serializers.ValidationError("Model is required.")
        return value

    def validate_year(self, value):
        if not value or len(str(value)) != 4:
            raise serializers.ValidationError("Year must be a 4-digit number.")
        return value

    def validate_vin(self, value):
        if not value or len(value) != 17:
            raise serializers.ValidationError("VIN must be exactly 17 characters.")
        if Vehicle.objects.filter(vin__iexact=value).exists():
            raise serializers.ValidationError("A vehicle with this VIN already exists.")
        return value

    def validate_license_plate(self, value):
        if not value:
            raise serializers.ValidationError("License plate is required.")
        if Vehicle.objects.filter(license_plate__iexact=value).exists():
            raise serializers.ValidationError("A vehicle with this license plate already exists.")
        return value
