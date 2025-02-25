import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Open Menu
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✖</button>
        <h4 className="text-center text-light mt-3">Menu</h4>
        <button className="btn btn-primary w-100" onClick={() => navigate("/teacher-consultations")}>
          View Teacher Consultations
        </button>
      </div>

      {/* Welcome Message */}
      <h2 className="text-center text-success mt-5">Teacher Dashboard</h2>
      <p className="text-center text-muted">
        Welcome! Use the menu to manage consultations.
      </p>

      {/* Sidebar Styles */}
      <style>
        {`
          .dashboard-container {
            position: relative;
          }

          .menu-btn {
            position: absolute;
            top: 10px; 
            left:10px;
            background:rgb(45, 141, 219);
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
          }
          .menu-btn:hover {
            background: #495057;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -250px;
            width: 250px;
            height: 100%;
            background: #343a40;
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 1000;
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
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: white;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 15px;
          }
        `}
      </style>
    </div>
  );
}

export default TeacherDashboard;
