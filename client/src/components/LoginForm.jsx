import { useState } from "react";
import "../styles/login.css";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [data, setData] = useState();
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, passcode });

    if (!passcode || !email) {
      setNotification({
        message: data.message || "Unable to sign in.",
        type: "error",
      });
      return;
    }

    const my_details = { email, password: passcode };

    const response = await fetch(`http://localhost:5000/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(my_details),
    });

    const data = await response.json();
    setData(data);

    setNotification({
      message: data.message || "Unable to sign in.",
      type: data.success ? "success" : "error",
    });

    setTimeout(() => {
      localStorage.setItem("token", data.token);
      data.success && nav("/main");
      setData(null);
    }, 2000);

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    console.log("Login successful:", data);
  };

  return (
    <form className="login-card">
      <h1 className="login-title">Sign In</h1>
      <p className="login-subtitle">
        Sign in and jump back into the Thriftify community.
      </p>
      {/* <Notification message={notification.message} type={notification.type} /> */}
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
        <Notification message={notification.message} type={notification.type} />
        <button className="submit-btn" onClick={handleSubmit} type="button">
          Sign in
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
