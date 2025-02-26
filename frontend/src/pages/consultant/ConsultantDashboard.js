import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <br></br>
          <br></br>
          <h3 className="text-light">Consultant Panel</h3>
        </div>

        {userRole === "Consultant" && (
          <button className="btn btn-light-blue w-100" onClick={() => navigate("/consultations")}>
            🔍 View Consultations
          </button>
        )}

        {userRole === "Teacher" && (
          <button className="btn btn-warning w-100 mt-2" onClick={() => navigate("/teacher-consultations")}>
            📖 View Teacher Consultations
          </button>
        )}  
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-primary">Welcome, Consultant!</h2>
        <p className="text-center text-secondary">Manage consultations and student interactions.</p>
      </div>

      {/* 🔹 Theme and Styling */}
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
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
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

          /* Welcome Text */
          .dashboard-content {
            padding: 50px;
            text-align: center;
            width: 100%;
            max-width: 800px;
          }

          .title-text {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            text-shadow: 2px 2px 10px rgba(0, 123, 255, 0.5);
          }

          .subtitle-text {
            font-size: 18px;
            color: #ddd;
            margin-top: 10px;
          }

          /* Responsive Design */
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

export default ConsultantDashboard;
