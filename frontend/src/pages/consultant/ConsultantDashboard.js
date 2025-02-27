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
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          body {
            background: linear-gradient(rgba(0, 0, 0, 0), rgba(82, 24, 24, 0)),
              url('https://images.pexels.com/photos/3473569/pexels-photo-3473569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
                no-repeat center center/cover;
            background-attachment: fixed;
            color: white;
          }

          .dashboard-container {
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
            background: rgba(255, 255, 255, 0);
            transform: scale(1.1);
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
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

          .main-content {
            flex-grow: 1;
            padding: 20px;
            height:300px; 
            backdrop-filter:blur(15px);
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }

          .welcome-title {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 10px;
          }

          .welcome-subtitle {
            font-size: 1.2rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 40px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .stats-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .stats-card h4 {
            font-size: 1.2rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 10px;
          }

          .stats-card .count {
            font-size: 2rem;
            font-weight: 600;
            color: #00aaff;
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
              left: -100%;
            }

            .sidebar.open {
              left: 0;
            }

            .main-content {
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

export default ConsultantDashboard;
