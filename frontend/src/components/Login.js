import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });

      if (response.data?.token) {
        login(response.data);
        localStorage.setItem("token", response.data.token);

        const { role } = response.data;
        if (role === "Student") {
          navigate("/student-dashboard");
        } else if (role === "Consultant") {
          navigate("/consultant-dashboard");
        } else if (role === "Teacher") {
          navigate("/teacher-dashboard");
        } else {
          alert("Invalid role. Contact support.");
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://cdn.pixabay.com/video/2024/03/18/204565-924698132_tiny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">Don't have an account?</p>
        <Link to="/signup" className="btn-signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;