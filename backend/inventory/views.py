
from rest_framework import viewsets, permissions
from .models import Part, StockAdjustmentLog
from .serializers import PartSerializer, StockAdjustmentLogSerializer
from core.permissions import IsAdminOrReadOnly

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['name', 'part_number']

class StockAdjustmentLogViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustmentLog.objects.all()
    serializer_class = StockAdjustmentLogSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['part__name', 'reason']
