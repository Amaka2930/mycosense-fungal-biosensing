const API_URL = "http://127.0.0.1:8000/api/auth";

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Unable to log in.");
  }

  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  localStorage.setItem("username", username);

  return data;
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("accessToken"));
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/password-reset/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.email ||
        data.detail ||
        "Unable to process the password reset request."
    );
  }

  return data;
}

export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const firstError = Object.values(data)[0];

    if (Array.isArray(firstError)) {
      throw new Error(firstError.join(" "));
    }

    if (typeof firstError === "object") {
      const nestedError = Object.values(firstError)[0];

      throw new Error(
        Array.isArray(nestedError)
          ? nestedError.join(" ")
          : String(nestedError)
      );
    }

    throw new Error(
      firstError || "Unable to create the account."
    );
  }

  return data;
}

export async function confirmPasswordReset({
  uid,
  token,
  newPassword,
  confirmPassword,
}) {
  const response = await fetch(
    `${API_URL}/password-reset-confirm/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (Array.isArray(data.new_password)) {
      throw new Error(data.new_password.join(" "));
    }

    throw new Error(
      data.confirm_password ||
        data.detail ||
        "Unable to reset your password."
    );
  }

  return data;
}