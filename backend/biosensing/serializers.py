from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from .models import Experiment, SensorData


User = get_user_model()


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


class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = "__all__"


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
    )

    confirm_password = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
        )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )

        return value.lower()

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": (
                        "The passwords do not match."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"],
        )