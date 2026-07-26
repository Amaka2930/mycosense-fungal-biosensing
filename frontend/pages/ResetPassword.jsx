import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { confirmPasswordReset } from "../services/authService.js";
import "./Login.css";

function ResetPassword() {
  const { uid, token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const data = await confirmPasswordReset({
        uid,
        token,
        newPassword,
        confirmPassword,
      });

      setMessage(data.detail);
      setNewPassword("");
      setConfirmPassword("");
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo"> </div>

          <h1>Create new password</h1>

          <p className="login-subtitle">
            Enter and confirm your new MycoSense password.
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-success">{message}</div>}

        {!message ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="new-password">New password</label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="confirm-password">
                Confirm new password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>
          </form>
        ) : (
          <div className="login-back-link">
            <Link to="/login">Sign in with your new password</Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;