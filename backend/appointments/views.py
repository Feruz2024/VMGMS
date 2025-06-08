from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Appointment
from .serializers import AppointmentSerializer
from core.permissions import IsAdmin, IsServiceAdvisor, IsTechnician

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['reason', 'status']
    ordering_fields = ['appointment_time', 'status']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin() or IsServiceAdvisor()]
        return [AllowAny()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'Cancelled'
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Create your views here.
