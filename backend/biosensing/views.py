from django.shortcuts import render
from rest_framework import generics

from .models import SensorData
from .serializers import SensorDataSerializer


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
        return SensorData.objects.latest("created_at")

# Create your views here.
