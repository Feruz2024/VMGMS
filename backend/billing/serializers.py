from rest_framework import serializers
from .models import Invoice, Payment
from workorders.serializers import WorkOrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'payment_method', 'payment_date', 'user']
        read_only_fields = ['id', 'payment_date', 'user']

class InvoiceSerializer(serializers.ModelSerializer):
    workorder = WorkOrderSerializer(read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    class Meta:
        model = Invoice
        fields = ['id', 'workorder', 'status', 'subtotal', 'tax_amount', 'total', 'amount_paid', 'created_at', 'updated_at', 'payments']
        read_only_fields = ['id', 'created_at', 'updated_at', 'payments', 'amount_paid']
