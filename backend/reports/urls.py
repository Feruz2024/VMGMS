from django.urls import path
from .views import SalesReportView, WorkOrderStatusReportView, InventoryLevelReportView

urlpatterns = [
    path('sales/', SalesReportView.as_view(), name='sales-report'),
    path('workorders/', WorkOrderStatusReportView.as_view(), name='workorder-status-report'),
    path('inventory-level/', InventoryLevelReportView.as_view(), name='inventory-level-report'),
]
