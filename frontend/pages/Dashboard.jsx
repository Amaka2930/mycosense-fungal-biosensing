import { useEffect, useState } from "react";
import {
  FiActivity,
  FiDroplet,
  FiSun,
  FiThermometer,
} from "react-icons/fi";
import { LuFlaskConical, LuSprout } from "react-icons/lu";

import SensorCard from "../components/SensorCard.jsx";
import { getLatestSensorData } from "../services/sensorService.js";

function Dashboard() {
  const [latestData, setLatestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLatestData() {
    try {
      const data = await getLatestSensorData();

      setLatestData(data);
      setError("");
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to connect to the sensor API.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLatestData();

    const intervalId = setInterval(loadLatestData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-content">
        <section className="dashboard-message">
          Loading live sensor data...
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-content">
      <section className="dashboard-toolbar">
        <div>
          <p className="dashboard-eyebrow">Live experiment monitoring</p>
          <h2>
            {latestData?.sample_type === "ldpe_exposed"
              ? "LDPE-Exposed Sample"
              : "Control Sample"}
          </h2>
        </div>

        <div
          className={`connection-badge ${
            error ? "connection-error" : "connection-active"
          }`}
        >
          <span />
          {error ? "Disconnected" : "Real-time"}
        </div>
      </section>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="sensor-card-grid">
        <SensorCard
          title="Temperature"
          value={latestData?.temperature}
          unit="°C"
          icon={<FiThermometer />}
          className="temperature-card"
        />

        <SensorCard
          title="Humidity"
          value={latestData?.humidity}
          unit="%"
          icon={<FiDroplet />}
          className="humidity-card"
        />

        <SensorCard
          title="Soil Moisture"
          value={latestData?.soil_moisture}
          unit="%"
          icon={<LuSprout />}
          className="moisture-card"
        />

        <SensorCard
          title="pH Level"
          value={latestData?.ph_value}
          icon={<LuFlaskConical />}
          className="ph-card"
        />

        <SensorCard
          title="Light Intensity"
          value={latestData?.light_intensity}
          unit="lux"
          icon={<FiSun />}
          className="light-card"
        />

        <SensorCard
          title="Electrical Activity"
          value={latestData?.electrical_activity}
          unit="mV"
          icon={<FiActivity />}
          status="Active"
          className="electrical-card"
        />
      </section>

      <section className="latest-reading-panel">
        <div>
          <p>Device</p>
          <strong>{latestData?.device_id ?? "--"}</strong>
        </div>

        <div>
          <p>Sample</p>
          <strong>
            {latestData?.sample_type === "ldpe_exposed"
              ? "LDPE Plastic Exposed"
              : "Control – No Plastic"}
          </strong>
        </div>

        <div>
          <p>Last updated</p>
          <strong>
            {latestData?.created_at
              ? new Date(latestData.created_at).toLocaleString("en-GB")
              : "--"}
          </strong>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;