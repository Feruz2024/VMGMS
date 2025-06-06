from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer
from workorders.models import WorkOrder, WorkOrderItem
from core.permissions import IsAdminOrServiceAdvisor
from decimal import Decimal
from django.shortcuts import get_object_or_404


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrServiceAdvisor]

    @action(detail=False, methods=['post'], url_path='generate', url_name='generate')
    @transaction.atomic
    def generate(self, request):
        workorder_id = request.data.get('workOrderId')
        workorder = get_object_or_404(WorkOrder, id=workorder_id)
        if hasattr(workorder, 'invoice'):
            return Response({'detail': 'Invoice already exists for this WorkOrder.'}, status=400)
        # Calculate subtotal, tax, total
        items = WorkOrderItem.objects.filter(work_order=workorder)
        subtotal = sum([(item.quantity or Decimal('0.00')) * (item.unit_price or Decimal('0.00')) for item in items])
        # TODO: Fetch tax rate from settings/config model
        tax_rate = Decimal('0.085')  # 8.5% default, replace with config
        tax_amount = subtotal * tax_rate
        total = subtotal + tax_amount
        invoice = Invoice.objects.create(
            workorder=workorder,
            subtotal=subtotal,
            tax_amount=tax_amount,
            total=total,
            status='Sent',
        )
        workorder.status = 'Invoiced'
        workorder.save()
        return Response(InvoiceSerializer(invoice).data, status=201)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrServiceAdvisor]

    def create(self, request, *args, **kwargs):
        invoice_id = request.data.get('invoice')
        invoice = get_object_or_404(Invoice, id=invoice_id)
        amount = Decimal(request.data.get('amount', '0.00'))
        with transaction.atomic():
            payment = Payment.objects.create(
                invoice=invoice,
                amount=amount,
                payment_method=request.data.get('payment_method'),
                user=request.user
            )
            invoice.amount_paid += amount
            if invoice.amount_paid >= invoice.total:
                invoice.status = 'Paid'
            elif invoice.amount_paid > 0:
                invoice.status = 'Partially Paid'
            invoice.save()
        return Response(PaymentSerializer(payment).data, status=201)
