import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiDroplet,
  FiRefreshCw,
  FiSun,
  FiThermometer,
} from "react-icons/fi";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getSensorHistory } from "../services/monitoringService.js";

function Monitoring() {
  const [sampleType, setSampleType] = useState("control");
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReadings() {
    try {
      setLoading(true);
      setError("");

      const data = await getSensorHistory(sampleType);
      setReadings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReadings();

    const intervalId = window.setInterval(loadReadings, 10000);

    return () => window.clearInterval(intervalId);
  }, [sampleType]);

  const latestReading = readings[0] || null;

  const chartData = useMemo(() => {
    return readings
      .slice(0, 30)
      .reverse()
      .map((reading) => ({
        ...reading,
        time: new Date(reading.created_at).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));
  }, [readings]);

  function displayValue(value, suffix = "") {
    return value === null || value === undefined ? "—" : `${value}${suffix}`;
  }

  return (
    <main className="dashboard-content">
      <section className="monitoring-heading">
        <div>
          <p className="dashboard-eyebrow">Live data collection</p>
          <h2>Monitoring</h2>
          <p>
            Monitor environmental conditions and fungal electrical activity.
          </p>
        </div>

        <div className="monitoring-controls">
          <select
            value={sampleType}
            onChange={(event) => setSampleType(event.target.value)}
            aria-label="Choose sample type"
          >
            <option value="control">Control – no plastic</option>
            <option value="ldpe_exposed">LDPE plastic exposed</option>
          </select>

          <button
            className="secondary-button"
            type="button"
            onClick={loadReadings}
            disabled={loading}
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>
      </section>

      {error && <div className="page-error">{error}</div>}

      <section className="monitoring-status-row">
        <span className="live-status">
          <span className="live-status-dot" />
          Live monitoring
        </span>

        <span>
          {readings.length} reading{readings.length === 1 ? "" : "s"} loaded
        </span>
      </section>

      <section className="monitoring-card-grid">
        <article className="monitoring-card">
          <div className="monitoring-icon temperature-icon">
            <FiThermometer />
          </div>
          <div>
            <span>Temperature</span>
            <strong>
              {displayValue(latestReading?.temperature, " °C")}
            </strong>
          </div>
        </article>

        <article className="monitoring-card">
          <div className="monitoring-icon humidity-icon">
            <FiDroplet />
          </div>
          <div>
            <span>Humidity</span>
            <strong>{displayValue(latestReading?.humidity, " %")}</strong>
          </div>
        </article>

        <article className="monitoring-card">
          <div className="monitoring-icon moisture-icon">🌱</div>
          <div>
            <span>Soil moisture</span>
            <strong>
              {displayValue(latestReading?.soil_moisture, " %")}
            </strong>
          </div>
        </article>

        <article className="monitoring-card">
          <div className="monitoring-icon ph-icon">pH</div>
          <div>
            <span>pH level</span>
            <strong>{displayValue(latestReading?.ph_value)}</strong>
          </div>
        </article>

        <article className="monitoring-card">
          <div className="monitoring-icon light-icon">
            <FiSun />
          </div>
          <div>
            <span>Light intensity</span>
            <strong>
              {displayValue(latestReading?.light_intensity, " lux")}
            </strong>
          </div>
        </article>

        <article className="monitoring-card">
          <div className="monitoring-icon activity-icon">
            <FiActivity />
          </div>
          <div>
            <span>Electrical activity</span>
            <strong>
              {displayValue(latestReading?.electrical_activity, " mV")}
            </strong>
          </div>
        </article>
      </section>

      {loading && readings.length === 0 && (
        <section className="monitoring-empty">
          <h3>Loading sensor readings...</h3>
        </section>
      )}

      {!loading && readings.length === 0 && (
        <section className="monitoring-empty">
          <h3>No readings found</h3>
          <p>
            Start the simulator or connect the Raspberry Pi to generate data for
            this sample.
          </p>
        </section>
      )}

      {chartData.length > 0 && (
        <section className="monitoring-chart-grid">
          <article className="monitoring-chart-card monitoring-chart-wide">
            <div className="chart-card-heading">
              <div>
                <h3>Temperature and humidity</h3>
                <p>Recent environmental readings</p>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" minTickGap={24} />
                  <YAxis yAxisId="temperature" />
                  <YAxis
                    yAxisId="humidity"
                    orientation="right"
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="temperature"
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#14945f"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    yAxisId="humidity"
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#2486c9"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="monitoring-chart-card">
            <div className="chart-card-heading">
              <div>
                <h3>Soil moisture and pH</h3>
                <p>Growing-medium conditions</p>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" minTickGap={24} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="soil_moisture"
                    name="Soil moisture (%)"
                    stroke="#57a66b"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="ph_value"
                    name="pH"
                    stroke="#8a5bd0"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="monitoring-chart-card">
            <div className="chart-card-heading">
              <div>
                <h3>Electrical activity</h3>
                <p>Recent fungal bioelectrical readings</p>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" minTickGap={24} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="electrical_activity"
                    name="Electrical activity (mV)"
                    stroke="#d73567"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}

export default Monitoring;