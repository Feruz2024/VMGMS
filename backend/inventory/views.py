from rest_framework import viewsets, permissions
from .models import Part, StockAdjustmentLog
from .serializers import PartSerializer, StockAdjustmentLogSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class PartViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Part.objects.filter(is_active=True)
    serializer_class = PartSerializer
    permission_classes = [AllowAny]
    search_fields = ['name', 'part_number']

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        part = self.get_object()
        data = request.data
        adjustment = data.get('adjustment_amount')
        new_qoh = data.get('new_qoh')
        reason = data.get('reason')
        user = request.user if request.user.is_authenticated else None
        if adjustment is not None:
            try:
                adjustment = int(adjustment)
            except Exception:
                return Response({'error': 'Invalid adjustment_amount'}, status=400)
            old_qoh = part.quantity_on_hand
            part.quantity_on_hand += adjustment
        elif new_qoh is not None:
            try:
                new_qoh = int(new_qoh)
            except Exception:
                return Response({'error': 'Invalid new_qoh'}, status=400)
            old_qoh = part.quantity_on_hand
            adjustment = new_qoh - old_qoh
            part.quantity_on_hand = new_qoh
        else:
            return Response({'error': 'Must provide adjustment_amount or new_qoh'}, status=400)
        if not reason:
            return Response({'error': 'Reason is required'}, status=400)
        part.save()
        from .models import StockAdjustmentLog
        StockAdjustmentLog.objects.create(
            part=part,
            user=user,
            adjustment_amount=adjustment,
            new_qoh=part.quantity_on_hand,
            reason=reason
        )
        return Response({'success': True, 'new_qoh': part.quantity_on_hand}, status=status.HTTP_200_OK)

class StockAdjustmentLogViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustmentLog.objects.all()
    serializer_class = StockAdjustmentLogSerializer
    permission_classes = [AllowAny]
    search_fields = ['part__name', 'reason']
