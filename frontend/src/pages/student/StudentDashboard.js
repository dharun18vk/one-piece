import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { logout } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    consultations: 0,
    pendingRequests: 0,
    approvedConsultations: 0
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
        approvedConsultations: response.data.approvedConsultations || 0
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
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3 className="text-center text-light mt-3">Student Panel</h3>
        <button className="btn btn-primary w-100" onClick={() => navigate("/request-consultation")}>Request Consultation</button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/student-consultations")}>My Consultations</button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/request-teacher-consultation")}>Teacher Consultation</button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/student-profile")}>My Profile</button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/student-dashboard")}>Back to Dashboard</button>
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="text-center text-primary">Welcome, Student!</h2>
        <p className="text-center text-secondary">Manage your consultations, requests, and profile from here.</p>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>📑 Consultations</h4>
              <p className="count">{stats.consultations}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>📝 Pending Requests</h4>
              <p className="count">{stats.pendingRequests}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card">
              <h4>✔ Approved Consultations</h4>
              <p className="count">{stats.approvedConsultations}</p>
            </div>
          </div>
        </div>
      </div>

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
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
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
            background: transparent;
            border: 2px solid #007bff;
            color: #007bff;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            font-size: 16px;
            transition: background 0.3s ease, transform 0.3s ease;
            cursor: pointer;
          }
          .btn-primary {
            background:rgb(0, 0, 0);
            border: none;
          }
          .btn-warning {
            background: #ffcc00;
            border: none;
          }
          .btn:hover {
            background:rgb(17, 144, 248);
            color: white;
            transform: scale(1.05);
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

          /* Dashboard Cards */
          .dashboard-card {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            color: white;
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

export default StudentDashboard;
