import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function getLatestSensorData() {
  const response = await api.get("/sensor-data/latest/");
  return response.data;
}

export async function getAllSensorData() {
  const response = await api.get("/sensor-data/");
  return response.data;
}

export async function getSensorDataBySample(sampleType) {
  const response = await api.get("/sensor-data/", {
    params: {
      sample_type: sampleType,
    },
  });

  return response.data;
}