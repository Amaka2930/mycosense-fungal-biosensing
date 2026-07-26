import { useState } from "react";
import {
  FiCheckCircle,
  FiDatabase,
  FiRefreshCw,
  FiSave,
  FiServer,
  FiSliders,
} from "react-icons/fi";

const DEFAULT_SETTINGS = {
  deviceId: "mycosense-pi-01",
  apiUrl: "http://127.0.0.1:8000/api",
  refreshInterval: 10,

  temperatureHigh: 30,
  temperatureLow: 15,

  humidityHigh: 90,
  humidityLow: 40,

  soilMoistureLow: 40,

  phLow: 5.5,
  phHigh: 8,

  electricalHigh: 2,
};

function loadSavedSettings() {
  try {
    const savedSettings = localStorage.getItem("mycosense-settings");

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSavedSettings);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value, type } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "number" ? Number(value) : value,
    }));

    setMessage("");
  }

  function saveSettings(event) {
    event.preventDefault();

    localStorage.setItem(
      "mycosense-settings",
      JSON.stringify(settings)
    );

    localStorage.setItem(
      "mycosense-thresholds",
      JSON.stringify({
        temperatureHigh: settings.temperatureHigh,
        temperatureLow: settings.temperatureLow,
        humidityHigh: settings.humidityHigh,
        humidityLow: settings.humidityLow,
        soilMoistureLow: settings.soilMoistureLow,
        phLow: settings.phLow,
        phHigh: settings.phHigh,
        electricalHigh: settings.electricalHigh,
      })
    );

    setMessage("Settings saved successfully.");
  }

  function resetDefaults() {
    setSettings(DEFAULT_SETTINGS);

    localStorage.removeItem("mycosense-settings");
    localStorage.removeItem("mycosense-thresholds");

    setMessage("Default settings restored.");
  }

  return (
    <main className="dashboard-content">
      <section className="settings-heading">
        <div>
          <p className="dashboard-eyebrow">
            Application configuration
          </p>

          <h2>Settings</h2>

          <p>
            Configure the Raspberry Pi device, API connection,
            refresh interval and sensor alert thresholds.
          </p>
        </div>
      </section>

      {message && (
        <div className="settings-success-message">
          <FiCheckCircle />
          <span>{message}</span>
        </div>
      )}

      <form className="settings-form" onSubmit={saveSettings}>
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <FiServer />
            </div>

            <div>
              <h3>Device configuration</h3>
              <p>
                Configure the Raspberry Pi or simulator sending
                readings to MycoSense.
              </p>
            </div>
          </div>

          <div className="settings-field-grid">
            <div className="settings-field">
              <label htmlFor="deviceId">Device ID</label>

              <input
                id="deviceId"
                name="deviceId"
                type="text"
                value={settings.deviceId}
                onChange={handleChange}
                required
              />

              <small>
                This should match the device ID used by your Raspberry Pi.
              </small>
            </div>

            <div className="settings-field">
              <label htmlFor="refreshInterval">
                Refresh interval
              </label>

              <div className="settings-input-unit">
                <input
                  id="refreshInterval"
                  name="refreshInterval"
                  type="number"
                  min="2"
                  max="300"
                  value={settings.refreshInterval}
                  onChange={handleChange}
                  required
                />

                <span>seconds</span>
              </div>

              <small>
                How often the frontend should request updated readings.
              </small>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <FiDatabase />
            </div>

            <div>
              <h3>API connection</h3>
              <p>
                Configure the Django REST API used by the frontend.
              </p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="apiUrl">Django API URL</label>

            <input
              id="apiUrl"
              name="apiUrl"
              type="url"
              value={settings.apiUrl}
              onChange={handleChange}
              required
            />

            <small>
              Local development currently uses
              http://127.0.0.1:8000/api.
            </small>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <FiSliders />
            </div>

            <div>
              <h3>Alert thresholds</h3>
              <p>
                Values outside these limits will appear on the Alerts
                page.
              </p>
            </div>
          </div>

          <div className="settings-field-grid">
            <div className="settings-field">
              <label htmlFor="temperatureHigh">
                Maximum temperature
              </label>

              <div className="settings-input-unit">
                <input
                  id="temperatureHigh"
                  name="temperatureHigh"
                  type="number"
                  step="0.1"
                  value={settings.temperatureHigh}
                  onChange={handleChange}
                  required
                />

                <span>°C</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="temperatureLow">
                Minimum temperature
              </label>

              <div className="settings-input-unit">
                <input
                  id="temperatureLow"
                  name="temperatureLow"
                  type="number"
                  step="0.1"
                  value={settings.temperatureLow}
                  onChange={handleChange}
                  required
                />

                <span>°C</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="humidityHigh">
                Maximum humidity
              </label>

              <div className="settings-input-unit">
                <input
                  id="humidityHigh"
                  name="humidityHigh"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.humidityHigh}
                  onChange={handleChange}
                  required
                />

                <span>%</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="humidityLow">
                Minimum humidity
              </label>

              <div className="settings-input-unit">
                <input
                  id="humidityLow"
                  name="humidityLow"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.humidityLow}
                  onChange={handleChange}
                  required
                />

                <span>%</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="soilMoistureLow">
                Minimum soil moisture
              </label>

              <div className="settings-input-unit">
                <input
                  id="soilMoistureLow"
                  name="soilMoistureLow"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.soilMoistureLow}
                  onChange={handleChange}
                  required
                />

                <span>%</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="electricalHigh">
                Electrical activity spike
              </label>

              <div className="settings-input-unit">
                <input
                  id="electricalHigh"
                  name="electricalHigh"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.electricalHigh}
                  onChange={handleChange}
                  required
                />

                <span>mV</span>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="phLow">Minimum pH</label>

              <input
                id="phLow"
                name="phLow"
                type="number"
                step="0.01"
                min="0"
                max="14"
                value={settings.phLow}
                onChange={handleChange}
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="phHigh">Maximum pH</label>

              <input
                id="phHigh"
                name="phHigh"
                type="number"
                step="0.01"
                min="0"
                max="14"
                value={settings.phHigh}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <div className="settings-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={resetDefaults}
          >
            <FiRefreshCw />
            Reset defaults
          </button>

          <button className="primary-button" type="submit">
            <FiSave />
            Save settings
          </button>
        </div>
      </form>
    </main>
  );
}

export default Settings;