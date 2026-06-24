import { useLocation } from "react-router-dom";
import Logo from "../assets/logo_1.svg?react";
// import Logo from "../assets/thriftify_clean.svg?react";

function AuthHeader() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <header id="auth_header">
      <div>
        <Logo className="logo" />

        <p>Every interaction creates value</p>
      </div>

      <button id="auth_header_btn" className="auth-btn">
        {isLoginPage ? "Sign Up" : "Sign In"}
      </button>
    </header>
  );
}

export default AuthHeader;
