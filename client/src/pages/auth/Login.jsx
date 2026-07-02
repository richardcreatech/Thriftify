import { useState } from "react";
import Successful from "../../components/Success";
import API_BASE_URL from "../../config/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [data, setData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.email) {
      setData({ message: "Please enter your email and password." });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setData({
          message:
            result.message ||
            "Login failed. Please check your details and try again.",
        });
        return;
      }

      const token = result.token || result.access_token || result.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }

      setFormData({ email: "", password: "" });
      setData({
        message:
          result.message || "Welcome back! Redirecting you to your profile...",
      });

      setTimeout(() => {
        window.location.assign("/main");
      }, 1200);

      console.log("Login successful:", result);
    } catch (error) {
      console.log("Something went wrong:", error);
      setData({ message: "Something went wrong. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {data && <Successful text={data.message} />}

      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit" className="primary-btn">
        Sign In
      </button>
    </form>
  );
}

export default Login;
