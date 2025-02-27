import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

      <style>
        {`
          .login-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') no-repeat center center/cover;
            background-attachment: fixed;
            position: fixed;
            top: 0;
            left: 0;
            color: white;
          }

          .login-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 50px;
            z-index: 2;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
            width: 400px;
            text-align: center;
          }

          .login-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
          }

          .input-group {
            margin-bottom: 25px;
            text-align: left;
          }

          .input-group label {
            font-size: 1.1rem;
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
          }

          .input-group input {
            width: 100%;
            padding: 14px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 16px;
            transition: border-color 0.3s ease;
          }

          .input-group input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }

          .input-group input:focus {
            outline: none;
            border-color: #00aaff;
            box-shadow: 0 0 10px rgba(0, 170, 255, 0.4);
          }

          .btn-login {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 16px 30px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            width: 100%;
            margin-top: 20px;
          }

          .btn-login:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .signup-text {
            margin-top: 30px;
            font-size: 1rem;
          }

          .btn-signup {
            display: inline-block;
            margin-top: 15px;
            padding: 12px 25px;
            border: 2px solid rgba(255, 255, 255, 0.7);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }

          .btn-signup:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: white;
          }
        `}
      </style>
    </div>
  );
};

export default Login;