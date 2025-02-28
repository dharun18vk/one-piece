import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import"../../styles/student/StudentDashboard.css";

function StudentDashboard() {
  const { logout } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    consultations: 0,
    pendingRequests: 0,
    approvedConsultations: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { role } = JSON.parse(storedUser);
      setUserRole(role);
    }
  }, []);

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

  const fetchStatistics = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You are not logged in!");
        navigate("/login");
        return;
      }

      const { token } = JSON.parse(storedUser);
      if (!token) {
        console.error("No auth token found!");
        return;
      }

      const response = await axios.get("http://localhost:5000/consultations/student-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        consultations: response.data.totalConsultations || 0,
        pendingRequests: response.data.pendingRequests || 0,
        approvedConsultations: response.data.approvedConsultations || 0,
      });
    } catch (error) {
      console.error("Failed to fetch statistics:", error.response?.data || error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 10000);
    return () => clearInterval(interval);
  }, [fetchStatistics]);

  return (
    <div className="dashboard-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/4063585/4063585-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={toggleSidebar}>
        ☰
      </button>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3 className="sidebar-title">Student Panel</h3>
        <button className="sidebar-btn" onClick={() => navigate("/request-consultation")}>
          📝 Request Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-consultations")}>
          📑 My Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/request-teacher-consultation")}>
          👨‍🏫 Teacher Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-profile")}>
          👤 My Profile
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-dashboard")}>
          🏠 Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="main-content">
        <h2 className="welcome-title">Welcome, Student!</h2>
        <p className="welcome-subtitle">Manage your consultations, requests, and profile from here.</p>

        <div className="stats-grid">
          <div className="stats-card">
            <h4>📑 Total Consultations</h4>
            <p className="count">{stats.consultations}</p>
          </div>
          <div className="stats-card">
            <h4>📝 Pending Requests</h4>
            <p className="count">{stats.pendingRequests}</p>
          </div>
          <div className="stats-card">
            <h4>✔ Approved Consultations</h4>
            <p className="count">{stats.approvedConsultations}</p>
          </div>
        </div>
      </div>
      <style>
        {`
          .main-content {
            flex-grow: 1;
            padding: 20px;
            height:300px; 
            backdrop-filter:blur(15px);
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }
        `}
      </style>
    </div>
  );
}

export default StudentDashboard;