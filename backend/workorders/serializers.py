from rest_framework import serializers

from .models import WorkOrder, WorkOrderItem

class WorkOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrderItem
        fields = [
            'id', 'work_order', 'item_type', 'description', 'quantity', 'unit_price', 'catalog_part', 'catalog_service'
        ]


class WorkOrderSerializer(serializers.ModelSerializer):
    items = WorkOrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    vehicle_display = serializers.SerializerMethodField()
    technician_name = serializers.SerializerMethodField()
    service_names = serializers.SerializerMethodField()
    deadline = serializers.SerializerMethodField()
    appointment = serializers.PrimaryKeyRelatedField(queryset=WorkOrder._meta.get_field('appointment').related_model.objects.all(), required=False, allow_null=True)

    class Meta:
        model = WorkOrder
        fields = [
            'id', 'customer', 'customer_name', 'vehicle', 'vehicle_display', 'technician', 'technician_name', 'status', 'customer_complaint', 'technician_notes', 'created_at', 'updated_at', 'items', 'service_names', 'deadline', 'appointment'
        ]
    def get_service_names(self, obj):
        # If you have a ManyToManyField for services, use obj.services.all()
        # If services are stored in items, filter for LABOR and return their descriptions
        if hasattr(obj, 'services'):
            return [s.name for s in obj.services.all()]
        elif hasattr(obj, 'items'):
            return [item.description for item in obj.items.all() if item.item_type == 'LABOR']
        return []

    def get_deadline(self, obj):
        # If you have a deadline field, return it. Otherwise, return updated_at or created_at as fallback
        if hasattr(obj, 'deadline') and obj.deadline:
            return obj.deadline
        return getattr(obj, 'updated_at', None)

    def get_vehicle_display(self, obj):
        if obj.vehicle:
            return f"{obj.vehicle.make} {obj.vehicle.model} ({obj.vehicle.license_plate})"
        return ""

    def get_technician_name(self, obj):
        if obj.technician:
            return obj.technician.get_full_name() or obj.technician.username
        return ""

    def validate(self, data):
        if not data.get('customer'):
            raise serializers.ValidationError({'customer': 'Customer is required.'})
        if not data.get('vehicle'):
            raise serializers.ValidationError({'vehicle': 'Vehicle is required.'})
        if not data.get('customer_complaint'):
            raise serializers.ValidationError({'customer_complaint': 'Customer complaint is required.'})
        return data
