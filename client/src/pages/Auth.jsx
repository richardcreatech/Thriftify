import React from "react";
import LoginForm from "../components/LoginForm";
import AuthHeader from "../components/AuthHeader";
import mascot from "../assets/mascot.png";

function Auth() {
  return (
    <main id="auth_main">
      <AuthHeader />
      <section id="auth_form">
        <LoginForm />
          </section>
          <img id="mascot" src={mascot} />
    </main>
  );
}

export default Auth;
