import React from "react";
import AuthForm from "./AuthForm";
import AuthShowcase from "./AuthShowcase";
import "../../styles/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import Successful from "../../components/Success";

function Auth() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notice, setNotice] = React.useState("");

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleAuthNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2400);
  };

  return (
    <div className="auth-container">
      {notice && <Successful text={notice} />}
      <div className="auth-card">
        <AuthShowcase />
        <AuthForm onNotice={handleAuthNotice} />
      </div>
      <span className="drk-mode" onClick={toggleDark}>
        {darkMode ? (
          <FontAwesomeIcon icon={faSun} />
        ) : (
          <FontAwesomeIcon icon={faMoon} />
        )}
      </span>
    </div>
  );
}

export default Auth;
