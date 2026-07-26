import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService.js";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await loginUser(formData.username, formData.password);
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">🍄</div>

          <h1>MycoSense</h1>

          <p className="login-subtitle">
            Fungal Bio-Sensing and Environmental Monitoring System
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="login-options">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="register-row">
          <span>Do not have an account?</span>
          <Link to="/register">Register a new user</Link>
        </div>

        <p className="login-footer">
          Authorised researchers only
        </p>
      </section>
    </main>
  );
}

export default Login;