import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequestConsultation() {
  const { logout } = useAuth();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
        return;
      }
      const { token } = JSON.parse(storedUser);

      await axios.post(
        "http://localhost:5000/consultations/create",
        { topic, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Consultation request created!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Failed to create consultation:", error);
      alert(error.response?.data?.error || "Error creating consultation. Try again!");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-container">
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="sidebar-title">Student Menu</h4>
        <button className="sidebar-btn" onClick={() => navigate("/request-consultation")}>
          📝 Request Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-consultations")}>
          📑 View My Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/request-teacher-consultation")}>
          👨‍🏫 Request Teacher Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-dashboard")}>
          🏠 Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="content-container">
        <h2 className="welcome-title">Request a Consultation</h2>
        <div className="form-card">
          <div className="form-group">
            <label className="form-label"><strong>Topic</strong></label>
            <input
              className="form-input"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><strong>Description</strong></label>
            <textarea
              className="form-input"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>

          <button className="submit-btn" onClick={handleCreate}>Submit Request</button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0; 
            overflow: hidden;
            font-family: 'Poppins', sans-serif;
          }

          body {
             width: 100vw;
             height: 100vh;
             background: linear-gradient(rgba(192, 187, 187, 0), rgba(0, 0, 0, 0)),
              url('https://images.pexels.com/photos/592077/pexels-photo-592077.jpeg')
                no-repeat center center/cover;
             top: 0;
             left: 0;
          }

          .main-container {
            display: flex;
            min-height: 100vh;
          }

          .menu-btn {
            position: fixed;
            top: 5px;
            left: 20px;
            background: rgba(255, 255, 255, 0);
            border: none;
            color: white;
            padding: 12px;
            font-size: 24px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .menu-btn.shift-right {
            left: 280px; /* Adjust based on sidebar width */
          }

          .menu-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
          }

          .sidebar {
            backdrop-filter: blur(20px); /* Glass effect */
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
          }

          .sidebar.open {
            left: 0;
          }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
          }

          .sidebar-overlay.show {
            display: block;
          }

          .sidebar-title {
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .sidebar-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .sidebar-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateX(5px);
          }

          .logout-btn {
            margin-top: auto;
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.5);
          }

          .logout-btn:hover {
            background: rgba(255, 0, 0, 0.2);
          }

          .content-container {
            flex-grow: 1;
            padding: 20px;
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }

          .welcome-title {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
            color:rgb(37, 37, 37);
          }

          .form-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px); /* Glass effect */
            padding: 20px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          }

          .form-group {
            margin-bottom: 20px;

          }

          .form-label {
            font-size: 1.1rem;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 8px;
            display: block;
          }

          .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 1rem;
            transition: border-color 0.3s ease, background 0.3s ease;
          }

          .form-input:focus {
            border-color: #00aaff;
            background: rgba(255, 255, 255, 0.1);
            outline: none;
          }

          .submit-btn {
            width: 100%;
            padding: 12px;
            background: #00aaff;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }

          .submit-btn:hover {
            background: #0088cc;
            transform: translateY(-2px);
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
              left: -100%;
            }

            .sidebar.open {
              left: 0;
            }

            .content-container {
              margin-left: 0;
            }

            .menu-btn.shift-right {
              left: calc(100% - 60px); /* Adjust for mobile */
            }
          }
        `}
      </style>
    </div>
  );
}

export default RequestConsultation;