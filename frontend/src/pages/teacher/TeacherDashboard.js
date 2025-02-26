import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TeacherDashboard() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3 className="text-center text-light mt-3">Teacher Panel</h3>
        <button className="btn btn-primary w-100" onClick={() => navigate("/teacher-consultations")}>
          View Consultations
        </button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/student-requests")}>
          Student Requests
        </button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/teacher-profile")}>
          My Profile
        </button>
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-success">Welcome, Teacher!</h2>
        <p className="text-center text-muted">Manage consultations, student requests, and your profile.</p>

        {/* 🔹 Teacher Statistics Section */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>👨‍🎓 Students Helped</h4>
              <p className="count">152</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>📅 Active Consultations</h4>
              <p className="count">12</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>⭐ Avg. Rating</h4>
              <p className="count">4.8 / 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Sidebar & Dashboard Styles */}
      <style>
        {`
          .dashboard-container {
            position: relative;
            background: #f4f6f9;
            min-height: 100vh;
            padding-top: 20px;
          }

          .menu-btn {
            position: fixed;
            top: 10px;
            left: 15px;
            background:rgb(43, 43, 43);
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 1100;
            transition: all 0.3s ease-in-out;
          }
          .menu-btn:hover {
            background:rgb(0, 0, 0);
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -270px;
            width: 270px;
            height: 100%;
            background: #343a40;
            padding: 20px;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
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

          .logout-container {
            margin-top: auto;
          }

          /* 🔹 Dashboard Cards */
          .dashboard-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease-in-out;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
          }
          .dashboard-card h4 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }
          .dashboard-card .count {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            margin-top: 10px;
          }

          /* 🔹 Responsive Layout */
          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default TeacherDashboard;
