from django.urls import path

from .views import LatestSensorDataView, SensorDataListCreateView

urlpatterns = [
    path(
        "sensor-data/",
        SensorDataListCreateView.as_view(),
        name="sensor-data-list-create",
    ),
    path(
        "sensor-data/latest/",
        LatestSensorDataView.as_view(),
        name="sensor-data-latest",
    ),
]