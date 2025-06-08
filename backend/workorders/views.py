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
