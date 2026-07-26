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


class Experiment(models.Model):
    SAMPLE_CHOICES = [
        ("control", "Control – no plastic"),
        ("ldpe_exposed", "LDPE plastic exposed"),
    ]

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("active", "Active"),
        ("completed", "Completed"),
        ("paused", "Paused"),
    ]

    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    sample_type = models.CharField(
        max_length=20,
        choices=SAMPLE_CHOICES,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="planned",
    )

    researcher = models.CharField(
        max_length=100,
        default="Chiamaka Joan",
    )

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} | {self.get_sample_type_display()}"