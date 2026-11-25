import React from "react";
import AuthHeader from "../../components/AuthHeader";
import "../../styles/signup.css";
import { Outlet } from "react-router-dom";
import ProgressStepper from "../../components/ProgressStepper";

function SignUp() {
  return (
    <main id="auth_main" className="onboarding_page">
      <AuthHeader />
      <section id="onboarding_space">
        <section id="onboarding_box">
          <ProgressStepper  />
          <Outlet />
        </section>
      </section>
    </main>
  );
}

export default SignUp;
