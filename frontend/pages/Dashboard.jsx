import { useEffect, useState } from "react";
import {
  FiActivity,
  FiDroplet,
  FiRefreshCw,
  FiSun,
  FiThermometer,
} from "react-icons/fi";

import { getLatestSensorData } from "../services/sensorService.js";
import SensorCard from "../components/SensorCard.jsx";

function Dashboard() {
  const [sampleType, setSampleType] = useState("ldpe_exposed");
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLatestReading() {
    try {
      setLoading(true);
      setError("");

      const data = await getLatestSensorData(sampleType);
      setSensorData(data);
    } catch (err) {
      setError(err.message);
      setSensorData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLatestReading();

    const intervalId = window.setInterval(loadLatestReading, 10000);

    return () => window.clearInterval(intervalId);
  }, [sampleType]);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(dateValue).toLocaleString("en-GB");
  }

  function sampleLabel(value) {
    return value === "ldpe_exposed"
      ? "LDPE Plastic Exposed"
      : "Control – No Plastic";
  }

  return (
    <main className="dashboard-content">
      <section className="dashboard-top-row">
        <div>
          <p className="dashboard-eyebrow">Live experiment monitoring</p>
          <h2>{sampleLabel(sampleType)}</h2>
          <p>
            Latest environmental and fungal bioelectrical measurements.
          </p>
        </div>

        <div className="dashboard-controls">
          <select
            value={sampleType}
            onChange={(event) => setSampleType(event.target.value)}
            aria-label="Select dashboard sample"
          >
            <option value="control">Control – no plastic</option>
            <option value="ldpe_exposed">LDPE plastic exposed</option>
          </select>

          <button
            className="secondary-button"
            type="button"
            onClick={loadLatestReading}
            disabled={loading}
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </section>

      {error && <div className="page-error">{error}</div>}

      <section className="dashboard-live-row">
        <span className="live-status">
          <span className="live-status-dot" />
          {loading ? "Updating..." : "Real-time"}
        </span>

        <span>
          {sensorData
            ? `Last updated: ${formatDate(sensorData.created_at)}`
            : "No reading available"}
        </span>
      </section>

      {sensorData && (
        <>
          <section className="sensor-card-grid">
            <SensorCard
              label="Temperature"
              value={sensorData.temperature}
              unit="°C"
              icon={<FiThermometer />}
              tone="temperature"
            />

            <SensorCard
              label="Humidity"
              value={sensorData.humidity}
              unit="%"
              icon={<FiDroplet />}
              tone="humidity"
            />

            <SensorCard
              label="Soil Moisture"
              value={sensorData.soil_moisture}
              unit="%"
              icon="🌱"
              tone="moisture"
            />

            <SensorCard
              label="pH Level"
              value={sensorData.ph_value}
              unit=""
              icon="pH"
              tone="ph"
            />

            <SensorCard
              label="Light Intensity"
              value={sensorData.light_intensity}
              unit="lux"
              icon={<FiSun />}
              tone="light"
            />

            <SensorCard
              label="Electrical Activity"
              value={sensorData.electrical_activity}
              unit="mV"
              icon={<FiActivity />}
              tone="activity"
            />
          </section>

          <section className="latest-reading-panel">
            <div>
              <span>Device</span>
              <strong>{sensorData.device_id}</strong>
            </div>

            <div>
              <span>Sample</span>
              <strong>{sampleLabel(sensorData.sample_type)}</strong>
            </div>

            <div>
              <span>Reading ID</span>
              <strong>#{sensorData.id}</strong>
            </div>
          </section>
        </>
      )}

      {!loading && !sensorData && !error && (
        <section className="monitoring-empty">
          <h3>No dashboard data available</h3>
          <p>Start the simulator or send a reading from the Raspberry Pi.</p>
        </section>
      )}
    </main>
  );
}

export default Dashboard;