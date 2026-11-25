import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Name() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!cleanFirstName || !cleanLastName) {
      alert("Please enter your first and last name.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("onboardingToken");

      if (!token) {
        alert("Your onboarding session has expired. Please register again.");
        navigate("/onboarding/email");
        return;
      }

      const response = await fetch("http://localhost:5000/auth/set_name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to save your name.");
        return;
      }

      navigate("/onboarding/username");
    } catch (err) {
      console.error("Save name error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="onboarding_form">
      <div className="form_header">
        <h1>Tell us about yourself</h1>

        <p>
          This helps buyers recognize you on Thriftify.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="firstName">First Name</label>

          <input
            id="firstName"
            type="text"
            placeholder="Richard"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            autoComplete="given-name"
            required
          />
        </div>

        <div className="input_group">
          <label htmlFor="lastName">Last Name</label>

          <input
            id="lastName"
            type="text"
            placeholder="Mgbahurike"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            autoComplete="family-name"
            required
          />
        </div>

        <small>
          What should we call you? We'll display this on your profile.
        </small>

        <button
          type="submit"
          disabled={
            loading ||
            !firstName.trim() ||
            !lastName.trim()
          }
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </form>
    </section>
  );
}

export default Name;