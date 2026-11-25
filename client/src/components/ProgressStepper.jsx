import React from "react";
import { useLocation } from "react-router-dom";

const steps = [
  { name: "Email", path: "/onboarding" },
  { name: "Verification", path: "/onboarding/verify" },
  { name: "Password", path: "/onboarding/password" },
  { name: "Name", path: "/onboarding/name" },
  { name: "Username", path: "/onboarding/username" },
  { name: "Profile", path: "/onboarding/profile" },
];

function ProgressStepper() {
  const location = useLocation();

  const currentStep = steps.findIndex(
    (step) => step.path === location.pathname,
  );

  return (
    <header id="progress_stepper">
      <ul id="progress_list">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <li
              key={step.path}
              className={`step ${
                isCompleted ? "completed" : isActive ? "active" : "upcoming"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="step-content">
                <div className="circle">{isCompleted ? "✓" : i + 1}</div>

                <p>{step.name}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </header>
  );
}

export default ProgressStepper;
