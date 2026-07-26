from django.urls import path

from .views import (
    ExperimentDetailView,
    ExperimentListCreateView,
    LatestSensorDataView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    SensorDataListCreateView,
    UserRegistrationView,
)


urlpatterns = [
    path(
        "sensor-data/",
        SensorDataListCreateView.as_view(),
        name="sensor-data-list-create",
    ),
    path(
        "sensor-data/latest/",
        LatestSensorDataView.as_view(),
        name="latest-sensor-data",
    ),
    path(
        "experiments/",
        ExperimentListCreateView.as_view(),
        name="experiment-list-create",
    ),
    path(
        "experiments/<int:pk>/",
        ExperimentDetailView.as_view(),
        name="experiment-detail",
    ),
    path(
        "auth/password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset",
    ),
    path(
        "auth/password-reset-confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
    "auth/register/",
    UserRegistrationView.as_view(),
    name="user-register",
),
]