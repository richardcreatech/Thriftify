import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Email() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to register. Please try again.");
        return;
      }

      // Save the onboarding token
      localStorage.setItem("onboardingToken", data.token);

      // Navigate to OTP verification
      navigate("/onboarding/verify");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="onboarding_form">
      <div className="form_header">
        <h1>Let's get started</h1>
        <p>Create your Thriftify seller account using your email address.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <small>
            We'll send a 6-digit verification code to this email address.
          </small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Continue →"}
        </button>
      </form>
    </section>
  );
}

export default Email;