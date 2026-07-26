import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getSensorDataBySample } from "../services/sensorService.js";

const METRICS = [
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

function calculateAverage(readings, field) {
  const validValues = readings
    .map((reading) => Number(reading[field]))
    .filter((value) => Number.isFinite(value));

  if (validValues.length === 0) {
    return null;
  }

  const total = validValues.reduce((sum, value) => sum + value, 0);
  return total / validValues.length;
}

function formatValue(value, unit = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(2)}${unit ? ` ${unit}` : ""}`;
}

function Analysis() {
  const [controlReadings, setControlReadings] = useState([]);
  const [ldpeReadings, setLdpeReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalysisData() {
    try {
      setLoading(true);
      setError("");

      const [controlData, ldpeData] = await Promise.all([
        getSensorDataBySample("control"),
        getSensorDataBySample("ldpe_exposed"),
      ]);

      setControlReadings(controlData);
      setLdpeReadings(ldpeData);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to retrieve analysis data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const comparisonData = useMemo(() => {
    return METRICS.map((metric) => {
      const controlAverage = calculateAverage(
        controlReadings,
        metric.key
      );

      const ldpeAverage = calculateAverage(
        ldpeReadings,
        metric.key
      );

      const difference =
        controlAverage !== null && ldpeAverage !== null
          ? ldpeAverage - controlAverage
          : null;

      const percentageChange =
        controlAverage !== null &&
        controlAverage !== 0 &&
        ldpeAverage !== null
          ? ((ldpeAverage - controlAverage) / controlAverage) * 100
          : null;

      return {
        ...metric,
        control: controlAverage,
        ldpe: ldpeAverage,
        difference,
        percentageChange,
      };
    });
  }, [controlReadings, ldpeReadings]);

  const electricalComparison = comparisonData.find(
    (metric) => metric.key === "electrical_activity"
  );

  return (
    <main className="dashboard-content">
      <section className="analysis-heading">
        <div>
          <p className="dashboard-eyebrow">Control versus exposure</p>
          <h2>Analysis</h2>
          <p>
            Compare environmental conditions and fungal electrical activity
            between the control and LDPE-exposed samples.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAnalysisData}
          disabled={loading}
        >
          {loading ? "Updating..." : "Refresh analysis"}
        </button>
      </section>

      {error && <div className="page-error">{error}</div>}

      <section className="analysis-summary-grid">
        <article>
          <span>Control readings</span>
          <strong>{controlReadings.length}</strong>
          <p>No plastic exposure</p>
        </article>

        <article>
          <span>LDPE readings</span>
          <strong>{ldpeReadings.length}</strong>
          <p>Plastic-exposed sample</p>
        </article>

        <article>
          <span>Total readings</span>
          <strong>
            {controlReadings.length + ldpeReadings.length}
          </strong>
          <p>Available for comparison</p>
        </article>

        <article>
          <span>Electrical difference</span>
          <strong>
            {formatValue(electricalComparison?.difference, "mV")}
          </strong>
          <p>LDPE average minus control</p>
        </article>
      </section>

      {loading && (
        <section className="analysis-empty">
          <h3>Loading experimental analysis...</h3>
        </section>
      )}

      {!loading &&
        (controlReadings.length === 0 || ldpeReadings.length === 0) && (
          <section className="analysis-warning">
            <h3>More comparison data is needed</h3>
            <p>
              Both the control and LDPE-exposed samples need sensor readings
              before a complete comparison can be produced.
            </p>
          </section>
        )}

      {!loading && comparisonData.length > 0 && (
        <>
          <section className="analysis-table-card">
            <div className="analysis-card-heading">
              <div>
                <h3>Average comparison</h3>
                <p>
                  Mean values calculated from all available readings.
                </p>
              </div>
            </div>

            <div className="analysis-table-wrapper">
              <table className="analysis-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Control average</th>
                    <th>LDPE average</th>
                    <th>Difference</th>
                    <th>Percentage change</th>
                  </tr>
                </thead>

                <tbody>
                  {comparisonData.map((metric) => (
                    <tr key={metric.key}>
                      <td>
                        <strong>{metric.label}</strong>
                      </td>

                      <td>
                        {formatValue(metric.control, metric.unit)}
                      </td>

                      <td>
                        {formatValue(metric.ldpe, metric.unit)}
                      </td>

                      <td
                        className={
                          metric.difference > 0
                            ? "positive-difference"
                            : metric.difference < 0
                              ? "negative-difference"
                              : ""
                        }
                      >
                        {formatValue(metric.difference, metric.unit)}
                      </td>

                      <td>
                        {metric.percentageChange === null
                          ? "—"
                          : `${metric.percentageChange.toFixed(2)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analysis-chart-grid">
            <article className="analysis-chart-card">
              <div className="analysis-card-heading">
                <div>
                  <h3>Environmental comparison</h3>
                  <p>
                    Control and LDPE average readings by metric.
                  </p>
                </div>
              </div>

              <div className="analysis-chart-wrapper">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart
                    data={comparisonData.filter(
                      (metric) =>
                        metric.key !== "light_intensity"
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      angle={-20}
                      textAnchor="end"
                      height={85}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="control"
                      name="Control average"
                      fill="#8059c7"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="ldpe"
                      name="LDPE average"
                      fill="#14945f"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="analysis-chart-card">
              <div className="analysis-card-heading">
                <div>
                  <h3>Light intensity comparison</h3>
                  <p>
                    Average light measurements for both sample groups.
                  </p>
                </div>
              </div>

              <div className="analysis-chart-wrapper">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart
                    data={comparisonData.filter(
                      (metric) => metric.key === "light_intensity"
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="control"
                      name="Control average"
                      fill="#8059c7"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="ldpe"
                      name="LDPE average"
                      fill="#14945f"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="analysis-interpretation-card">
            <h3>Preliminary interpretation</h3>

            <p>
              These results show descriptive differences between the two
              sample groups. They do not, by themselves, prove that LDPE
              exposure caused the observed changes. Experimental duration,
              sensor calibration, environmental variation and sample size
              should be considered when interpreting the findings.
            </p>
          </section>
        </>
      )}
    </main>
  );
}

export default Analysis;