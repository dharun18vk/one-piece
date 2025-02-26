import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequestTeacherConsultation() {
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
        "http://localhost:5000/consultations/teacher-consultation",
        { topic, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Teacher consultation request created!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Failed to create teacher consultation:", error);
      alert("Error creating consultation. Try again!");
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const handleLogout = () => {
    logout(); // ✅ Clears user state
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Request a Teacher Consultation</h2>
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ 
      </button>

      {/* Sidebar Overlay (Closes sidebar when clicked) */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="text-center text-light mt-3">Menu</h4>
        <button className="btn btn-primary w-100 mb-2" onClick={() => navigate("/request-consultation")}>
          Request Consultation
        </button>
        <button className="btn btn-primary w-100" onClick={() => navigate("/student-consultations")}>
          View My Consultations
        </button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/request-teacher-consultation")}>
          Request Teacher Consultation
        </button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>      
      <div className="card p-4 shadow-lg">
        <div className="mb-3">
          <label className="form-label"><strong>Topic</strong></label>
          <input
            className="form-control"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Description</strong></label>
          <textarea
            className="form-control"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          ></textarea>
        </div>

        <button className="btn btn-success w-100" onClick={handleCreate}>
          Submit Request
        </button>
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
            background: #007bff;
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

export default RequestTeacherConsultation;
