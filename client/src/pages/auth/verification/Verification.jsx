
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const updateOtp = (startIndex, value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6 - startIndex);

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      nextOtp[startIndex] = digits[0] || "";
      digits.split("").forEach((digit, offset) => {
        nextOtp[startIndex + offset] = digit;
      });
      return nextOtp;
    });

    if (digits) {
      inputRefs.current[Math.min(startIndex + digits.length, 5)]?.focus();
    }
  };

  const handlePaste = (event, index) => {
    event.preventDefault();
    updateOtp(index, event.clipboardData.getData("text"));
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (!/^\d{6}$/.test(code)) {
      alert("Please enter a valid 6-digit verification code.");
      return;
    }

    const token = localStorage.getItem("onboardingToken");

    if (!token) {
      alert("Your verification session has expired. Please register again.");
      navigate("/onboarding/email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Verification failed. Please try again.");
        return;
      }

      navigate("/onboarding/password");
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="onboarding_form">
      <div className="form_header">
        <h1>Check your inbox</h1>
        <p>
          We've sent a 6-digit verification code to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label id="otp_label">Verification Code</label>

          <div className="otp_inputs" role="group" aria-labelledby="otp_label">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={index === 0 ? 6 : 1}
                value={digit}
                onChange={(event) => updateOtp(index, event.target.value)}
                onPaste={(event) => handlePaste(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                aria-label={`Digit ${index + 1} of 6`}
                required
              />
            ))}
          </div>
        </div>

        <div className="verification_footer">
          <p>Didn't receive the code?</p>
          <button type="button" disabled>
            Resend Code
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify →"}
        </button>
      </form>
    </section>
  );
}

export default Verification;
