from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'customer', 'vehicle', 'technician', 'appointment_time', 'reason', 'status', 'created_at', 'updated_at'
        ]

    def validate(self, data):
        if not data.get('customer'):
            raise serializers.ValidationError({'customer': 'Customer is required.'})
        if not data.get('vehicle'):
            raise serializers.ValidationError({'vehicle': 'Vehicle is required.'})
        if not data.get('appointment_time'):
            raise serializers.ValidationError({'appointment_time': 'Appointment time is required.'})
        if not data.get('reason'):
            raise serializers.ValidationError({'reason': 'Reason is required.'})
        return data
