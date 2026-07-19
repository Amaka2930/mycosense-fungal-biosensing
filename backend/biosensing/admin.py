from django.contrib import admin
#from django.contrib import admin

from .models import SensorData


@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = (
        "sample_type",
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
# Register your models here.
