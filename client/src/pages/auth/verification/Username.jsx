import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Username() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      alert("Please choose a username.");
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

      const response = await fetch("http://localhost:5000/auth/set_user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: cleanUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to save your username.");
        return;
      }

      // Registration onboarding is complete
      // localStorage.removeItem("onboardingToken");

      navigate("/onboarding/profile");
    } catch (err) {
      console.error("Username setup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="onboarding_form">
      <div className="form_header">
        <h1>Choose a username</h1>

        <p>
          This is your unique identity on Thriftify.
          Buyers can search and mention you using it.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="username">Username</label>

          <div className="username_input">
            <span>@</span>

            <input
              id="username"
              type="text"
              placeholder="richcreates"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase())
              }
              disabled={loading}
              required
            />
          </div>

          <small>
            Your profile will be:
            <strong>
              {" "}thriftify.com/@{username.trim() || "username"}
            </strong>
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
        >
          {loading ? "Saving username..." : "Finish →"}
        </button>
      </form>
    </section>
  );
}

export default Username;