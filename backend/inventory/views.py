
from rest_framework import viewsets, permissions
from .models import Part, StockAdjustmentLog
from .serializers import PartSerializer, StockAdjustmentLogSerializer
from rest_framework.permissions import AllowAny

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [AllowAny]
    search_fields = ['name', 'part_number']

class StockAdjustmentLogViewSet(viewsets.ModelViewSet):
    queryset = StockAdjustmentLog.objects.all()
    serializer_class = StockAdjustmentLogSerializer
    permission_classes = [AllowAny]
    search_fields = ['part__name', 'reason']
