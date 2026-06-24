import { useState } from "react";
import "../styles/login.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, passcode });
  };

  return (
    <form className="login-card">
      <h1 className="login-title">Sign In</h1>
      <p className="login-subtitle">
        Sign in and jump back into the Thriftify community.
      </p>

      <div className="login-form">
        <div className="input-wrapper">
          <input
            className="login-input"
            type="text"
            placeholder="Enter Email / Phone No"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <input
            className="login-input"
            type={showPasscode ? "text" : "password"}
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button
            className="toggle-btn"
            onClick={() => setShowPasscode((prev) => !prev)}
            type="button"
          >
            {showPasscode ? "Hide" : "Show"}
          </button>
        </div>

        <p className="trouble-link">
          <a href="#">Having trouble in sign in?</a>
        </p>

        <button className="submit-btn" onClick={handleSubmit} type="button">
          Sign in
        </button>
      </div>
    </form>
  );
}
