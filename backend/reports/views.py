
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from core.permissions import IsAdminOrServiceAdvisor
from workorders.models import WorkOrder
from users.models import User
from billing.models import Invoice
from django.db.models import Sum

class WorkOrderStatusReportView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        status = request.query_params.get('status')
        technician_id = request.query_params.get('technician_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        qs = WorkOrder.objects.all()
        if status:
            qs = qs.filter(status=status)
        if technician_id:
            qs = qs.filter(technician_id=technician_id)
        if start_date:
            qs = qs.filter(updated_at__date__gte=start_date)
        if end_date:
            qs = qs.filter(updated_at__date__lte=end_date)
        data = [
            {
                'id': wo.id,
                'status': wo.status,
                'technician': wo.technician_id,
                'customer': wo.customer_id,
                'vehicle': wo.vehicle_id,
                'created_at': wo.created_at,
                'updated_at': wo.updated_at,
            }
            for wo in qs
        ]
        return Response({'count': len(data), 'results': data})

class SalesReportView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        qs = Invoice.objects.filter(status='Paid')
        if start_date:
            qs = qs.filter(updated_at__date__gte=start_date)
        if end_date:
            qs = qs.filter(updated_at__date__lte=end_date)
        total_sales = qs.aggregate(total=Sum('total'))['total'] or 0
        invoice_count = qs.count()
        return Response({
            'total_sales': total_sales,
            'invoice_count': invoice_count,
        })


# Inventory Level Report
from inventory.models import Part

class InventoryLevelReportView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        threshold = request.query_params.get('threshold')
        try:
            threshold = int(threshold) if threshold is not None else 5
        except ValueError:
            threshold = 5
        low_parts = Part.objects.filter(quantity_on_hand__lte=threshold)
        data = [
            {
                'id': part.id,
                'part_number': part.part_number,
                'description': part.description,
                'quantity_on_hand': part.quantity_on_hand,
                'threshold': threshold,
            }
            for part in low_parts
        ]
        return Response({'count': len(data), 'results': data})
