import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConsultantDashboard() {
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
        ☰
      </button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="text-center text-light mt-3">Menu</h4>

        {/* Button for Consultants (View Student Consultations) */}
        {userRole === "Consultant" && (
          <button className="btn btn-primary w-100" onClick={() => navigate("/consultations")}>
            View Consultations
          </button>
        )}

        {/* ✅ Only show this button for Teachers */}
        {userRole === "Teacher" && (
          <button className="btn btn-warning w-100 mt-2" onClick={() => navigate("/teacher-consultations")}>
            View Teacher Consultations
          </button>
        )}
      </div>

      {/* Welcome Message */}
      <div className="dashboard-content">
        <h2 className="text-center text-success mt-5">Consultant Dashboard</h2>
        <p className="text-center text-muted">Welcome! Use the menu to navigate.</p>
      </div>

      {/* Sidebar Styles */}
      <style>
        {`
          /* Full Page Styling */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }

          /* Dashboard Container */
          .dashboard-container {
            position: relative;
            min-height: 100vh;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease-in-out;
          }

          /* Sidebar */
          .sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: #343a40;
            padding: 20px;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
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
            border-radius: 8px;
            padding: 10px;
            font-weight: bold;
          }
          .btn:hover {
            filter: brightness(90%);
            transform: scale(1.05);
          }

          /* Close Button */
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
          .close-btn:hover {
            color: #ff4757;
          }

          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 10px; 
            left: 15px;
            background:rgb(27, 27, 27);
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
            transform: scale(1.1);
          }

          /* Main Dashboard Content */
          .dashboard-content {
            padding: 50px;
            text-align: center;
            width: 100%;
            max-width: 800px;
          }

          /* Responsive Fix */
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
