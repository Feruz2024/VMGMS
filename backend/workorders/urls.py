from rest_framework.routers import DefaultRouter
from .views import WorkOrderViewSet, WorkOrderItemViewSet

router = DefaultRouter()
router.register(r'workorders', WorkOrderViewSet, basename='workorder')
router.register(r'workorder-items', WorkOrderItemViewSet, basename='workorderitem')

urlpatterns = router.urls
