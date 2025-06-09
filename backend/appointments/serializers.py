from rest_framework import serializers

from .models import Appointment
from services.models import Service
from workorders.models import WorkOrder

class AppointmentSerializer(serializers.ModelSerializer):
    services = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), many=True, required=False)
    workorders = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'customer', 'vehicle', 'technician', 'appointment_time', 'services', 'reason', 'status', 'created_at', 'updated_at', 'workorders'
        ]

    def validate(self, data):
        if not data.get('customer'):
            raise serializers.ValidationError({'customer': 'Customer is required.'})
        if not data.get('vehicle'):
            raise serializers.ValidationError({'vehicle': 'Vehicle is required.'})
        if not data.get('appointment_time'):
            raise serializers.ValidationError({'appointment_time': 'Appointment time is required.'})
        # services is now required for validation
        if 'services' in self.fields and (not data.get('services') or len(data.get('services')) == 0):
            raise serializers.ValidationError({'services': 'At least one service is required.'})
        return data
