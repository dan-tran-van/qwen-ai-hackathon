from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .api.views import AgencyViewSet
from .api.views import DepartmentViewSet

app_name = "orgs"

router = DefaultRouter()
router.register("agencies", AgencyViewSet, basename="agency")
router.register("departments", DepartmentViewSet, basename="department")

urlpatterns = router.urls
