from rest_framework import serializers
from .models import Part, StockAdjustmentLog

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = [
            'id', 'part_number', 'description', 'selling_price', 'cost_price', 'quantity_on_hand', 'is_active', 'created_at', 'updated_at'
        ]

    def validate_part_number(self, value):
        if not value:
            raise serializers.ValidationError("Part number is required.")
        return value

    def validate_selling_price(self, value):
        if value is None:
            raise serializers.ValidationError("Selling price is required.")
        return value

    def validate_cost_price(self, value):
        if value is None:
            raise serializers.ValidationError("Cost price is required.")
        return value

class StockAdjustmentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockAdjustmentLog
        fields = [
            'id', 'part', 'user', 'adjustment_amount', 'new_qoh', 'reason', 'timestamp'
        ]
