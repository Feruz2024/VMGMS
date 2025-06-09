from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import WorkOrder, WorkOrderItem
from .serializers import WorkOrderSerializer, WorkOrderItemSerializer
from core.permissions import IsAdmin, IsServiceAdvisor, IsTechnician


class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer
    permission_classes = [AllowAny]


    def partial_update(self, request, *args, **kwargs):
        # Intercept status change to 'Invoiced' for inventory decrement
        instance = self.get_object()
        old_status = instance.status
        response = super().partial_update(request, *args, **kwargs)
        new_status = request.data.get('status')
        if old_status != 'Invoiced' and new_status == 'Invoiced':
            from inventory.models import Part, StockAdjustmentLog
            from django.db import transaction
            with transaction.atomic():
                for item in instance.items.filter(item_type='PART', catalog_part__isnull=False):
                    part = item.catalog_part
                    if part and part.is_active:
                        old_qoh = part.quantity_on_hand
                        part.quantity_on_hand -= int(item.quantity)
                        part.save()
                        StockAdjustmentLog.objects.create(
                            part=part,
                            user=request.user if request.user.is_authenticated else None,
                            adjustment_amount=-int(item.quantity),
                            new_qoh=part.quantity_on_hand,
                            reason=f"Auto-decrement for WO#{instance.id} invoicing"
                        )
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'Cancelled'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WorkOrderItemViewSet(viewsets.ModelViewSet):
    queryset = WorkOrderItem.objects.all()
    serializer_class = WorkOrderItemSerializer
    permission_classes = [AllowAny]

# Create your views here.
