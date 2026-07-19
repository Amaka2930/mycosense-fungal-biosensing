import random
import time

import requests


API_URL = "http://127.0.0.1:8000/api/sensor-data/"


def send_reading(sample_type):
    payload = {
        "sample_type": sample_type,
        "device_id": "mycosense-pi-01",
        "temperature": round(random.uniform(20, 30), 1),
        "humidity": round(random.uniform(60, 90), 1),
        "soil_moisture": round(random.uniform(45, 75), 1),
        "ph_value": round(random.uniform(6.0, 7.5), 2),
        "light_intensity": round(random.uniform(200, 600), 1),
        "electrical_activity": round(random.uniform(0.8, 2.5), 2),
    }

    response = requests.post(API_URL, json=payload, timeout=10)

    if response.status_code == 201:
        print(f"Data sent successfully: {sample_type}")
        print(response.json())
    else:
        print(f"Error {response.status_code}: {response.text}")

    print("-" * 50)


while True:
    send_reading("control")
    send_reading("ldpe_exposed")
    time.sleep(10)