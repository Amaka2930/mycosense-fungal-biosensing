from django.contrib import admin

from .models import Experiment, SensorData


@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = (
        "sample_type",
        "device_id",
        "temperature",
        "humidity",
        "soil_moisture",
        "ph_value",
        "electrical_activity",
        "created_at",
    )

    list_filter = ("sample_type", "device_id")
    search_fields = ("device_id",)
    ordering = ("-created_at",)


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sample_type",
        "status",
        "researcher",
        "start_date",
        "end_date",
    )

    list_filter = ("sample_type", "status")
    search_fields = ("name", "researcher")
    ordering = ("-created_at",)