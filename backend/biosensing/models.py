from django.db import models
from django.utils import timezone


class SensorData(models.Model):
    SAMPLE_CHOICES = [
        ("control", "Control – no plastic"),
        ("ldpe_exposed", "LDPE plastic exposed"),
    ]

    sample_type = models.CharField(
        max_length=20,
        choices=SAMPLE_CHOICES,
    )

    device_id = models.CharField(
        max_length=100,
        default="mycosense-pi-01",
    )

    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    soil_moisture = models.FloatField(null=True, blank=True)
    ph_value = models.FloatField(null=True, blank=True)
    light_intensity = models.FloatField(null=True, blank=True)
    electrical_activity = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.get_sample_type_display()} | "
            f"{self.temperature}°C | "
            f"{self.humidity}%"
        )