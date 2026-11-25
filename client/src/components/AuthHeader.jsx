import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo_1.svg?react";
// import Logo from "../assets/thriftify_clean.svg?react";

function AuthHeader() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/"  ||  location.pathname === "/signin"  ;

  return (
    <header id="auth_header">
      <div>
        <Logo className="logo" />

        <p>Every interaction creates value</p>
      </div>

      <Link to={isLoginPage ? "/onboarding" :"/"} style={{textDecoration: "none", color: "#000"}} id="auth_header_btn" className="auth-btn">
        {isLoginPage ? "Sign Up" : "Sign In"}
      </Link>
    </header>
  );
}

export default AuthHeader;
