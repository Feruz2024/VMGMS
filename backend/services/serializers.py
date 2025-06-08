from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'category', 'description', 'default_hours', 'default_rate', 'created_at', 'updated_at'
        ]

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name is required.")
        return value

    def validate_default_hours(self, value):
        if value is None:
            raise serializers.ValidationError("Default hours is required.")
        return value

    def validate_default_rate(self, value):
        if value is None:
            raise serializers.ValidationError("Default rate is required.")
        return value
