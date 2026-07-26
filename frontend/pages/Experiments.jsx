import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import {
  createExperiment,
  deleteExperiment,
  getExperiments,
  updateExperiment,
} from "../services/experimentService.js";

const EMPTY_FORM = {
  name: "",
  description: "",
  sample_type: "control",
  status: "planned",
  researcher: "Chiamaka Joan",
  start_date: "",
  end_date: "",
};

function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadExperiments() {
    try {
      setLoading(true);
      setError("");
      const data = await getExperiments();
      setExperiments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiments();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditForm(experiment) {
    setEditingId(experiment.id);

    setFormData({
      name: experiment.name,
      description: experiment.description || "",
      sample_type: experiment.sample_type,
      status: experiment.status,
      researcher: experiment.researcher,
      start_date: experiment.start_date,
      end_date: experiment.end_date || "",
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        end_date: formData.end_date || null,
      };

      if (editingId) {
        await updateExperiment(editingId, payload);
      } else {
        await createExperiment(payload);
      }

      closeForm();
      await loadExperiments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(experiment) {
    const confirmed = window.confirm(
      `Delete "${experiment.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteExperiment(experiment.id);
      await loadExperiments();
    } catch (err) {
      setError(err.message);
    }
  }

  function formatSampleType(sampleType) {
    return sampleType === "ldpe_exposed"
      ? "LDPE Plastic Exposed"
      : "Control – No Plastic";
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not set";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB");
  }

  return (
    <main className="dashboard-content">
      <section className="experiments-heading">
        <div>
          <p className="dashboard-eyebrow">Research configuration</p>
          <h2>Experiments</h2>
          <p>
            Create, update and manage the control and LDPE-exposed fungal
            studies.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={showForm ? closeForm : openCreateForm}
        >
          <FiPlus />
          {showForm ? "Close form" : "New experiment"}
        </button>
      </section>

      {error && <div className="page-error">{error}</div>}

      {showForm && (
        <form className="experiment-form" onSubmit={handleSubmit}>
          <div className="form-title-row form-field-full">
            <div>
              <p className="dashboard-eyebrow">
                {editingId ? "Update record" : "New research record"}
              </p>
              <h3>{editingId ? "Edit experiment" : "Create experiment"}</h3>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="name">Experiment name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="sample_type">Sample type</label>
            <select
              id="sample_type"
              name="sample_type"
              value={formData.sample_type}
              onChange={handleChange}
            >
              <option value="control">Control – no plastic</option>
              <option value="ldpe_exposed">LDPE plastic exposed</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="researcher">Researcher</label>
            <input
              id="researcher"
              name="researcher"
              type="text"
              value={formData.researcher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="start_date">Start date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="end_date">End date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions form-field-full">
            <button
              className="secondary-button"
              type="button"
              onClick={closeForm}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update experiment"
                  : "Save experiment"}
            </button>
          </div>
        </form>
      )}

      <section className="experiment-summary">
        <div>
          <span>Total experiments</span>
          <strong>{experiments.length}</strong>
        </div>

        <div>
          <span>Active</span>
          <strong>
            {
              experiments.filter(
                (experiment) => experiment.status === "active"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Control</span>
          <strong>
            {
              experiments.filter(
                (experiment) => experiment.sample_type === "control"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>LDPE exposed</span>
          <strong>
            {
              experiments.filter(
                (experiment) => experiment.sample_type === "ldpe_exposed"
              ).length
            }
          </strong>
        </div>
      </section>

      {loading && <p className="loading-message">Loading experiments...</p>}

      {!loading && experiments.length === 0 && (
        <section className="page-placeholder">
          <h3>No experiments found</h3>
          <p>Create your first control or LDPE-exposed experiment.</p>
        </section>
      )}

      {!loading && experiments.length > 0 && (
        <section className="experiment-grid">
          {experiments.map((experiment) => (
            <article className="experiment-card" key={experiment.id}>
              <div className="experiment-card-top">
                <span
                  className={`status-badge status-${experiment.status}`}
                >
                  {experiment.status}
                </span>

                <div className="experiment-actions">
                  <button
                    type="button"
                    aria-label={`Edit ${experiment.name}`}
                    onClick={() => openEditForm(experiment)}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="danger-icon-button"
                    type="button"
                    aria-label={`Delete ${experiment.name}`}
                    onClick={() => handleDelete(experiment)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div
                className={`sample-indicator sample-${experiment.sample_type}`}
              >
                {experiment.sample_type === "ldpe_exposed"
                  ? "LDPE"
                  : "CTRL"}
              </div>

              <h3>{experiment.name}</h3>

              <p className="experiment-sample">
                {formatSampleType(experiment.sample_type)}
              </p>

              <p className="experiment-description">
                {experiment.description || "No description provided."}
              </p>

              <div className="experiment-meta">
                <div>
                  <FiUser />
                  <span>Researcher</span>
                  <strong>{experiment.researcher}</strong>
                </div>

                <div>
                  <FiCalendar />
                  <span>Started</span>
                  <strong>{formatDate(experiment.start_date)}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Experiments;