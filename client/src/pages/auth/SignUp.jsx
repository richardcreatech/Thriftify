import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Successful from "../../components/Success";
import API_BASE_URL from "../../config/api";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState("");
  const [modal, setModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setData({ message: "Please fill in your name, email, and password." });
      return;
    }

    if (password !== confirmPassword) {
      setData({ message: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password,
        }),
      });

      const result = await response
        .json()
        .catch(() => ({ message: "Something went wrong." }));
      setData(result);

      if (!response.ok) {
        console.error("Signup failed:", result);
        return;
      }

      setModal(true);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      console.log("Signup successful:", result);
    } catch (error) {
      console.error(error);
      setData({ message: "Something went wrong. Please try again." });
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      {modal && (
        <div id="check_mail_space">
          <div id="check_mail_modal">
            <div className="icon">
              <FontAwesomeIcon icon={faPaperPlane} id="paper-plane-icon" />
            </div>

            <div className="content">
              <p>Check your Mail</p>
              <button onClick={() => setModal(false)} id="just_checked">
                Just Checked
              </button>
            </div>
          </div>
        </div>
      )}
      {data && <Successful text={data.error ? data.error : data.message} />}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="primary-btn">Sign Up</button>
    </form>
  );
}

export default SignUp;
