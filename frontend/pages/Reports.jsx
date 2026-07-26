import { useEffect, useMemo, useState } from "react";
import {
  FiDownload,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getAllSensorData,
  getSensorDataBySample,
} from "../services/sensorService.js";

const REPORT_METRICS = [
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
  },
  {
    key: "soil_moisture",
    label: "Soil moisture",
    unit: "%",
  },
  {
    key: "ph_value",
    label: "pH level",
    unit: "",
  },
  {
    key: "light_intensity",
    label: "Light intensity",
    unit: "lux",
  },
  {
    key: "electrical_activity",
    label: "Electrical activity",
    unit: "mV",
  },
];

function calculateStatistics(readings, field) {
  const values = readings
    .map((reading) => Number(reading[field]))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return {
      average: null,
      minimum: null,
      maximum: null,
    };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    average: total / values.length,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}

function formatNumber(value, unit = "") {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value.toFixed(2)}${unit ? ` ${unit}` : ""}`;
}

function formatSampleType(sampleType) {
  if (sampleType === "control") {
    return "Control – No Plastic";
  }

  if (sampleType === "ldpe_exposed") {
    return "LDPE Plastic Exposed";
  }

  return "All Samples";
}

function escapeCsvValue(value) {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function Reports() {
  const [sampleType, setSampleType] = useState("all");
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReportData() {
    try {
      setLoading(true);
      setError("");

      const data =
        sampleType === "all"
          ? await getAllSensorData()
          : await getSensorDataBySample(sampleType);

      setReadings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to retrieve report data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReportData();
  }, [sampleType]);

  const statistics = useMemo(() => {
    return REPORT_METRICS.map((metric) => ({
      ...metric,
      ...calculateStatistics(readings, metric.key),
    }));
  }, [readings]);

  const latestReading = readings[0] || null;

  const controlCount = readings.filter(
    (reading) => reading.sample_type === "control"
  ).length;

  const ldpeCount = readings.filter(
    (reading) => reading.sample_type === "ldpe_exposed"
  ).length;

  function downloadCsv() {
    if (readings.length === 0) {
      return;
    }

    const headers = [
      "ID",
      "Sample Type",
      "Device ID",
      "Temperature (C)",
      "Humidity (%)",
      "Soil Moisture (%)",
      "pH",
      "Light Intensity (lux)",
      "Electrical Activity (mV)",
      "Created At",
    ];

    const rows = readings.map((reading) => [
      reading.id,
      reading.sample_type,
      reading.device_id,
      reading.temperature,
      reading.humidity,
      reading.soil_moisture,
      reading.ph_value,
      reading.light_intensity,
      reading.electrical_activity,
      reading.created_at,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `mycosense-${sampleType}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <main className="dashboard-content">
      <section className="reports-heading">
        <div>
          <p className="dashboard-eyebrow">Research evidence</p>

          <h2>Reports</h2>

          <p>
            Review statistical summaries and export the collected fungal
            biosensing data.
          </p>
        </div>

        <div className="reports-actions">
          <select
            value={sampleType}
            onChange={(event) => setSampleType(event.target.value)}
            aria-label="Choose report sample"
          >
            <option value="all">All samples</option>
            <option value="control">Control – no plastic</option>
            <option value="ldpe_exposed">
              LDPE plastic exposed
            </option>
          </select>

          <button
            className="secondary-button"
            type="button"
            onClick={loadReportData}
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={downloadCsv}
            disabled={readings.length === 0}
          >
            <FiDownload />
            Export CSV
          </button>
        </div>
      </section>

      {error && <div className="page-error">{error}</div>}

      <section className="report-summary-grid">
        <article className="report-summary-primary">
          <FiFileText />

          <div>
            <span>Total readings</span>
            <strong>{readings.length}</strong>
          </div>
        </article>

        <article>
          <span>Control readings</span>
          <strong>{controlCount}</strong>
        </article>

        <article>
          <span>LDPE readings</span>
          <strong>{ldpeCount}</strong>
        </article>

        <article>
          <span>Selected dataset</span>
          <strong>{formatSampleType(sampleType)}</strong>
        </article>
      </section>

      {loading && readings.length === 0 && (
        <section className="report-empty">
          <h3>Preparing report...</h3>
          <p>Retrieving sensor records from Django.</p>
        </section>
      )}

      {!loading && readings.length === 0 && (
        <section className="report-empty">
          <h3>No report data found</h3>
          <p>
            Start the simulator or connect the Raspberry Pi to collect
            readings.
          </p>
        </section>
      )}

      {!loading && readings.length > 0 && (
        <>
          <section className="report-information-panel">
            <div>
              <span>Latest device</span>
              <strong>
                {latestReading?.device_id || "Not available"}
              </strong>
            </div>

            <div>
              <span>Latest sample</span>
              <strong>
                {formatSampleType(latestReading?.sample_type)}
              </strong>
            </div>

            <div>
              <span>Latest record</span>
              <strong>
                {latestReading
                  ? new Date(
                      latestReading.created_at
                    ).toLocaleString("en-GB")
                  : "Not available"}
              </strong>
            </div>
          </section>

          <section className="report-table-card">
            <div className="report-card-heading">
              <h3>Statistical summary</h3>

              <p>
                Average, minimum and maximum values calculated from the
                selected dataset.
              </p>
            </div>

            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Average</th>
                    <th>Minimum</th>
                    <th>Maximum</th>
                  </tr>
                </thead>

                <tbody>
                  {statistics.map((metric) => (
                    <tr key={metric.key}>
                      <td>
                        <strong>{metric.label}</strong>
                      </td>

                      <td>
                        {formatNumber(metric.average, metric.unit)}
                      </td>

                      <td>
                        {formatNumber(metric.minimum, metric.unit)}
                      </td>

                      <td>
                        {formatNumber(metric.maximum, metric.unit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="report-readings-card">
            <div className="report-card-heading">
              <h3>Recent sensor readings</h3>

              <p>
                The latest 20 records from the selected dataset.
              </p>
            </div>

            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Date and time</th>
                    <th>Sample</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Moisture</th>
                    <th>pH</th>
                    <th>Light</th>
                    <th>Electrical</th>
                  </tr>
                </thead>

                <tbody>
                  {readings.slice(0, 20).map((reading) => (
                    <tr key={reading.id}>
                      <td>
                        {new Date(
                          reading.created_at
                        ).toLocaleString("en-GB")}
                      </td>

                      <td>
                        {formatSampleType(reading.sample_type)}
                      </td>

                      <td>
                        {reading.temperature ?? "—"} °C
                      </td>

                      <td>{reading.humidity ?? "—"}%</td>

                      <td>
                        {reading.soil_moisture ?? "—"}%
                      </td>

                      <td>{reading.ph_value ?? "—"}</td>

                      <td>
                        {reading.light_intensity ?? "—"} lux
                      </td>

                      <td>
                        {reading.electrical_activity ?? "—"} mV
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Reports;