import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TeacherDashboard() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ studentsHelped: 0, activeConsultations: 0, avgRating: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      const data = { studentsHelped: 152, activeConsultations: 12, avgRating: 4.8 };
      setStats(data);
    }
    fetchStats();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <br></br>
          <br></br>
          <h3 className="text-light">Teacher Panel</h3>
        </div>
        <button className="btn btn-light-blue w-100" onClick={() => navigate("/teacher-consultations")}>
          View Consultations
        </button>
        <button className="btn btn-light-blue w-100 mt-2" onClick={() => navigate("/teacher-profile")}>
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
        <h2 className="text-center text-primary">Welcome, Teacher!</h2>
        <p className="text-center text-secondary">Manage consultations, student requests, and your profile.</p>

        {/* 🔹 Teacher Statistics Section */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>👨‍🎓 Students Helped</h4>
              <p className="count">{stats.studentsHelped}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>📅 Active Consultations</h4>
              <p className="count">{stats.activeConsultations}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>⭐ Avg. Rating</h4>
              <p className="count">{stats.avgRating} / 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Updated Styles */}
      <style>
        {`
          /* General Styling */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
          }

          body {
            background: #0d1117;
            color: white;
            overflow-x: hidden;
          }
          .dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          /* Sidebar */
          .sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: #121212;
            padding: 20px;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            border-right: 2px solid rgba(255, 255, 255, 0.1);
          }
          .sidebar.open {
            left: 0;
          }

          /* Sidebar Overlay */
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
          .dashboard-card{
          
          }
          .sidebar-overlay.show {
            display: block;
          }

          /* Sidebar Buttons */
          .btn {
            transition: all 0.3s ease-in-out;
            border-radius: 10px;
            padding: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .btn-primary {
            background:rgb(0, 170, 255);
            border: none;
          }
          .btn-warning {
            background: #ffcc00;
            border: none;
          }
          .btn:hover {
            transform: scale(1.1);
            box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
          }

          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 10px;
            left:2px;
            background: transparent;
            color: white;
            border: none;
            padding: 12px 18px;
            font-size: 22px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 1100;
            transition: all 0.3s ease-in-out;
          }
          .menu-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            transform: scale(1.1);
            radius:50%;
          }

          /* 🔹 Dashboard Cards */
          .dashboard-card {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            color: white;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.7);
          }
          .dashboard-card h4 {
            font-size: 18px;
            font-weight: 600;
            color: #ccc;
          }
          .dashboard-card .count {
            font-size: 24px;
            font-weight: bold;
            color: #00aaff;
            margin-top: 10px;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
          @media (max-width: 576px) {
            .row {
              flex-direction: column;
              align-items: center;
            }
            .col-md-4 {
              width: 80%;
              margin-bottom: 15px;
            }
          }
          
        `}
      </style>
    </div>
  );
}

export default TeacherDashboard;
