import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/consultant/ConsultantDashboard.css";

function ConsultantDashboard() {
  const { logout } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { role } = JSON.parse(storedUser);
      setUserRole(role);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/3578982/3578982-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-title">
          <br></br>
          <br></br>
          <h3 className="text-light">Consultant Panel</h3>
        </div>

        {userRole === "Consultant" && (
          <button className="sidebar-btn" onClick={() => navigate("/consultations")}>
            🔍 View Consultations
          </button>
        )}

        {userRole === "Teacher" && (
          <button className="btn btn-warning w-100 mt-2" onClick={() => navigate("/teacher-consultations")}>
            📖 View Teacher Consultations
          </button>
        )}  
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="welcome-title">Welcome, Consultant!</h2>
        <p className="welcome-subtitle">Manage consultations and student interactions.</p>
      </div>

      {/* 🔹 Theme and Styling */}
      <style>
        {`
          .main-content {
            flex-grow: 2;
            padding: 12 0px;
            align-items:center;
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
            display: inline-block;
            place-items: center; /* Align both horizontally & vertically */
            height: 30vh;
            backdrop-filter: blur(3px);
            margin-top:100px;
            background: rgba(39, 39, 39, 0.18);
            
          }
          
        `}
      </style>
    </div>
  );
}

export default ConsultantDashboard;
