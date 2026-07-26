import { useState } from "react";
import { Link } from "react-router-dom";

import { requestPasswordReset } from "../services/authService.js";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(email);
      setMessage(data.detail);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">🍄</div>

          <h1>Forgot password</h1>

          <p className="login-subtitle">
            Enter the email address connected to your MycoSense
            account.
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-success">{message}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              required
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Sending..."
              : "Send password reset link"}
          </button>
        </form>

        <div className="login-back-link">
          <Link to="/login">Return to sign in</Link>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;