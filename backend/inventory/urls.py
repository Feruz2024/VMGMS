from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartViewSet, StockAdjustmentLogViewSet

router = DefaultRouter()
router.register(r'parts', PartViewSet, basename='part')
router.register(r'stock-adjustments', StockAdjustmentLogViewSet, basename='stockadjustmentlog')

urlpatterns = [
    path('', include(router.urls)),
]
