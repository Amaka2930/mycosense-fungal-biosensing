import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService.js";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      await registerUser(formData);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Your account was created successfully. You can now sign in.",
        },
      });
    } catch (registrationError) {
      setError(registrationError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card register-card">
        <div className="login-brand">
          <div className="login-logo">🍄</div>

          <h1>Create account</h1>

          <p className="login-subtitle">
            Register as an authorised MycoSense researcher.
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="register-name-grid">
            <div className="login-field">
              <label htmlFor="firstName">First name</label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="lastName">Last name</label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <div className="login-back-link">
          <Link to="/login">
            Already have an account? Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;