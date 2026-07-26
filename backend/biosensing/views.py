from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Experiment, SensorData
from .serializers import ExperimentSerializer, SensorDataSerializer

from .serializers import (
    ExperimentSerializer,
    SensorDataSerializer,
    UserRegistrationSerializer,
)

User = get_user_model()


class SensorDataListCreateView(generics.ListCreateAPIView):
    serializer_class = SensorDataSerializer

    def get_queryset(self):
        queryset = SensorData.objects.all().order_by("-created_at")

        sample_type = self.request.query_params.get("sample_type")
        device_id = self.request.query_params.get("device_id")

        if sample_type:
            queryset = queryset.filter(sample_type=sample_type)

        if device_id:
            queryset = queryset.filter(device_id=device_id)

        return queryset


class LatestSensorDataView(generics.RetrieveAPIView):
    serializer_class = SensorDataSerializer

    def get_object(self):
        queryset = SensorData.objects.all()

        sample_type = self.request.query_params.get("sample_type")
        device_id = self.request.query_params.get("device_id")

        if sample_type:
            queryset = queryset.filter(sample_type=sample_type)

        if device_id:
            queryset = queryset.filter(device_id=device_id)

        return queryset.latest("created_at")


class ExperimentListCreateView(generics.ListCreateAPIView):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer


class ExperimentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"email": "Please enter your email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(
            email__iexact=email,
            is_active=True,
        ).first()

        response_message = {
            "detail": (
                "If an account exists for that email address, "
                "a password reset link has been generated."
            )
        }

        if user is None:
            return Response(
                response_message,
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_url = (
            f"{settings.FRONTEND_URL}/reset-password/"
            f"{uid}/{token}"
        )

        send_mail(
            subject="Reset your MycoSense password",
            message=(
                f"Hello {user.get_username()},\n\n"
                "A request was received to reset your "
                "MycoSense password.\n\n"
                "Open the link below to create a new password:\n"
                f"{reset_url}\n\n"
                "If you did not request this change, "
                "you can ignore this message."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            response_message,
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not all(
            [
                uid,
                token,
                new_password,
                confirm_password,
            ]
        ):
            return Response(
                {"detail": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {
                    "confirm_password": (
                        "The passwords do not match."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )
            user = User.objects.get(pk=user_id)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": (
                        "This password reset link is invalid."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(
            user,
            token,
        ):
            return Response(
                {
                    "detail": (
                        "This password reset link is invalid "
                        "or has expired."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(
                new_password,
                user=user,
            )

        except ValidationError as error:
            return Response(
                {
                    "new_password": list(
                        error.messages
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {
                "detail": (
                    "Your password has been reset successfully."
                )
            },
            status=status.HTTP_200_OK,
        )