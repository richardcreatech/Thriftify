import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api.js";

function Password() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return alert("Your password must be at least 8 characters long.");
    }

    if (!/[A-Z]/.test(password)) {
      return alert("Your password must contain at least one uppercase letter.");
    }

    if (!/\d/.test(password)) {
      return alert("Your password must contain at least one number.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("onboardingToken");

      if (!token) {
        alert("Your onboarding session has expired. Please register again.");
        navigate("/onboarding/email");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to save your password.");
        return;
      }

      navigate("/onboarding/name");
    } catch (err) {
      console.error("Set password error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="onboarding_form">
      <div className="form_header">
        <h1>Create a password</h1>
        <p>Your password keeps your Thriftify account secure.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="password">Password</label>

          <div className="password_input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="input_group">
          <label htmlFor="confirmPassword">Confirm Password</label>

          <div className="password_input">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={loading}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="password_requirements">
          <p>✓ At least 8 characters</p>
          <p>✓ One uppercase letter</p>
          <p>✓ One number</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Continue →"}
        </button>
      </form>
    </section>
  );
}

export default Password;
