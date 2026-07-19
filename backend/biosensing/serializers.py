from rest_framework import serializers

from .models import SensorData


class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = [
            "id",
            "sample_type",
            "device_id",
            "temperature",
            "humidity",
            "soil_moisture",
            "ph_value",
            "light_intensity",
            "electrical_activity",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_humidity(self, value):
        if value is not None and not 0 <= value <= 100:
            raise serializers.ValidationError(
                "Humidity must be between 0 and 100 percent."
            )
        return value

    def validate_ph_value(self, value):
        if value is not None and not 0 <= value <= 14:
            raise serializers.ValidationError(
                "pH must be between 0 and 14."
            )
        return value

    def validate_soil_moisture(self, value):
        if value is not None and not 0 <= value <= 100:
            raise serializers.ValidationError(
                "Soil moisture must be between 0 and 100 percent."
            )
        return value