import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiDroplet,
  FiRefreshCw,
  FiThermometer,
} from "react-icons/fi";

import { getAllSensorData } from "../services/sensorService.js";

const DEFAULT_THRESHOLDS = {
  temperatureHigh: 30,
  temperatureLow: 15,
  humidityHigh: 90,
  humidityLow: 40,
  soilMoistureLow: 40,
  phLow: 5.5,
  phHigh: 8,
  electricalHigh: 2,
};

function loadThresholds() {
  try {
    const savedThresholds = localStorage.getItem(
      "mycosense-thresholds"
    );

    if (!savedThresholds) {
      return DEFAULT_THRESHOLDS;
    }

    return {
      ...DEFAULT_THRESHOLDS,
      ...JSON.parse(savedThresholds),
    };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

function createAlert({
  reading,
  type,
  title,
  message,
  severity,
}) {
  return {
    id: `${reading.id}-${type}`,
    readingId: reading.id,
    sampleType: reading.sample_type,
    createdAt: reading.created_at,
    type,
    title,
    message,
    severity,
  };
}

function generateAlerts(readings, thresholds) {
  const alerts = [];

  readings.slice(0, 150).forEach((reading) => {
    const temperature = Number(reading.temperature);
    const humidity = Number(reading.humidity);
    const moisture = Number(reading.soil_moisture);
    const phValue = Number(reading.ph_value);
    const electrical = Number(reading.electrical_activity);

    if (
      Number.isFinite(temperature) &&
      temperature > thresholds.temperatureHigh
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "temperature-high",
          title: "High temperature detected",
          message: `${temperature}°C exceeded the configured maximum of ${thresholds.temperatureHigh}°C.`,
          severity: "critical",
        })
      );
    }

    if (
      Number.isFinite(temperature) &&
      temperature < thresholds.temperatureLow
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "temperature-low",
          title: "Low temperature detected",
          message: `${temperature}°C fell below the configured minimum of ${thresholds.temperatureLow}°C.`,
          severity: "warning",
        })
      );
    }

    if (
      Number.isFinite(humidity) &&
      humidity > thresholds.humidityHigh
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "humidity-high",
          title: "High humidity detected",
          message: `${humidity}% exceeded the configured maximum of ${thresholds.humidityHigh}%.`,
          severity: "warning",
        })
      );
    }

    if (
      Number.isFinite(humidity) &&
      humidity < thresholds.humidityLow
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "humidity-low",
          title: "Low humidity detected",
          message: `${humidity}% fell below the configured minimum of ${thresholds.humidityLow}%.`,
          severity: "warning",
        })
      );
    }

    if (
      Number.isFinite(moisture) &&
      moisture < thresholds.soilMoistureLow
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "moisture-low",
          title: "Low soil moisture detected",
          message: `${moisture}% fell below the configured minimum of ${thresholds.soilMoistureLow}%.`,
          severity: "critical",
        })
      );
    }

    if (
      Number.isFinite(phValue) &&
      (phValue < thresholds.phLow ||
        phValue > thresholds.phHigh)
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "ph-range",
          title: "pH outside expected range",
          message: `A pH reading of ${phValue} is outside the configured range of ${thresholds.phLow} to ${thresholds.phHigh}.`,
          severity: "warning",
        })
      );
    }

    if (
      Number.isFinite(electrical) &&
      electrical > thresholds.electricalHigh
    ) {
      alerts.push(
        createAlert({
          reading,
          type: "electrical-high",
          title: "Electrical activity spike",
          message: `${electrical} mV exceeded the configured threshold of ${thresholds.electricalHigh} mV.`,
          severity: "critical",
        })
      );
    }
  });

  return alerts.sort(
    (firstAlert, secondAlert) =>
      new Date(secondAlert.createdAt) -
      new Date(firstAlert.createdAt)
  );
}

function Alerts() {
  const [readings, setReadings] = useState([]);
  const [sampleFilter, setSampleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [thresholds, setThresholds] = useState(loadThresholds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAlertData() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllSensorData();

      setReadings(Array.isArray(data) ? data : []);
      setThresholds(loadThresholds());
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to retrieve alert data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlertData();
  }, []);

  const allAlerts = useMemo(() => {
    return generateAlerts(readings, thresholds);
  }, [readings, thresholds]);

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      const matchesSample =
        sampleFilter === "all" ||
        alert.sampleType === sampleFilter;

      const matchesSeverity =
        severityFilter === "all" ||
        alert.severity === severityFilter;

      return matchesSample && matchesSeverity;
    });
  }, [allAlerts, sampleFilter, severityFilter]);

  function formatSampleType(sampleType) {
    return sampleType === "ldpe_exposed"
      ? "LDPE Plastic Exposed"
      : "Control – No Plastic";
  }

  function getAlertIcon(type) {
    if (type.includes("temperature")) {
      return <FiThermometer />;
    }

    if (
      type.includes("humidity") ||
      type.includes("moisture")
    ) {
      return <FiDroplet />;
    }

    if (type.includes("electrical")) {
      return <FiActivity />;
    }

    return <FiAlertTriangle />;
  }

  return (
    <main className="dashboard-content">
      <section className="alerts-heading">
        <div>
          <p className="dashboard-eyebrow">
            Threshold notifications
          </p>

          <h2>Alerts</h2>

          <p>
            Review unusual environmental readings and fungal
            electrical activity.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={loadAlertData}
          disabled={loading}
        >
          <FiRefreshCw />
          {loading ? "Checking..." : "Refresh alerts"}
        </button>
      </section>

      {error && <div className="page-error">{error}</div>}

      <section className="alert-summary-grid">
        <article>
          <span>Total alerts</span>
          <strong>{allAlerts.length}</strong>
        </article>

        <article>
          <span>Critical alerts</span>
          <strong>
            {
              allAlerts.filter(
                (alert) => alert.severity === "critical"
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Warnings</span>
          <strong>
            {
              allAlerts.filter(
                (alert) => alert.severity === "warning"
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Readings checked</span>
          <strong>{Math.min(readings.length, 150)}</strong>
        </article>
      </section>

      <section className="alert-filter-row">
        <select
          value={sampleFilter}
          onChange={(event) =>
            setSampleFilter(event.target.value)
          }
          aria-label="Filter alerts by sample"
        >
          <option value="all">All samples</option>
          <option value="control">Control</option>
          <option value="ldpe_exposed">LDPE exposed</option>
        </select>

        <select
          value={severityFilter}
          onChange={(event) =>
            setSeverityFilter(event.target.value)
          }
          aria-label="Filter alerts by severity"
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
        </select>
      </section>

      {loading && (
        <section className="alerts-empty">
          <h3>Checking sensor thresholds...</h3>
          <p>Please wait while the readings are analysed.</p>
        </section>
      )}

      {!loading && filteredAlerts.length === 0 && (
        <section className="alerts-empty alerts-clear">
          <FiCheckCircle />

          <h3>No matching alerts</h3>

          <p>
            The selected readings are within the configured
            thresholds.
          </p>
        </section>
      )}

      {!loading && filteredAlerts.length > 0 && (
        <section className="alerts-list">
          {filteredAlerts.map((alert) => (
            <article
              className={`alert-card alert-${alert.severity}`}
              key={alert.id}
            >
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>

              <div className="alert-content">
                <div className="alert-title-row">
                  <div>
                    <h3>{alert.title}</h3>
                    <p>{alert.message}</p>
                  </div>

                  <span
                    className={`alert-severity alert-severity-${alert.severity}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="alert-meta">
                  <span>
                    {formatSampleType(alert.sampleType)}
                  </span>

                  <span>Reading #{alert.readingId}</span>

                  <span>
                    {new Date(
                      alert.createdAt
                    ).toLocaleString("en-GB")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Alerts;