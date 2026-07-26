const SENSOR_API_URL = "http://127.0.0.1:8000/api/sensor-data/";

export async function getSensorHistory(sampleType = "") {
  const url = sampleType
    ? `${SENSOR_API_URL}?sample_type=${sampleType}`
    : SENSOR_API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve sensor readings.");
  }

  return response.json();
}