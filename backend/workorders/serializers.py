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

    class Meta:
        model = WorkOrder
        fields = [
            'id', 'customer', 'vehicle', 'technician', 'status', 'customer_complaint', 'technician_notes', 'created_at', 'updated_at', 'items'
        ]

    def validate(self, data):
        if not data.get('customer'):
            raise serializers.ValidationError({'customer': 'Customer is required.'})
        if not data.get('vehicle'):
            raise serializers.ValidationError({'vehicle': 'Vehicle is required.'})
        if not data.get('customer_complaint'):
            raise serializers.ValidationError({'customer_complaint': 'Customer complaint is required.'})
        return data
