import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequestConsultation() {
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
        "http://localhost:5000/consultations/create",
        { topic, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Consultation request created!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Failed to create consultation:", error);
      alert(error.response?.data?.error || "Error creating consultation. Try again!");
    }
  };

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
    <div className="main-container">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="text-center text-light mt-3">Student Menu</h4>
        <button className="btn btn-light w-100 mb-2" onClick={() => navigate("/request-consultation")}>Request Consultation</button>
        <button className="btn btn-light w-100" onClick={() => navigate("/student-consultations")}>View My Consultations</button>
        <button className="btn btn-light w-100 mt-2" onClick={() => navigate("/request-teacher-consultation")}>Request Teacher Consultation</button>
        <button className="btn btn-light w-100 mt-2" onClick={() => navigate("/student-dashboard")}>Back to Dashboard</button>
        <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="content-container">
        <h2 className="text-primary text-center">Request a Consultation</h2>
        <div className="card p-4 shadow-lg form-container">
          <div className="mb-3">
            <label className="form-label"><strong>Topic</strong></label>
            <input className="form-control" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Description</strong></label>
            <textarea className="form-control" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4"></textarea>
          </div>

          <button className="btn btn-success w-100" onClick={handleCreate}>Submit Request</button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          /* Main Layout */
          .main-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background:rgb(0, 0, 0);
          }
          body {
            background:rgb(0, 0, 0);
            color: white;
            overflow-x: hidden;
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

          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 15px;
            left: 15px;
            background:rgba(0, 123, 255, 0);
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
            radius:50%;
          }
          .btn-primary {
            background:rgb(0, 0, 0);
            border: none;
          }

          /* Main Content */
          .content-container {
            width: 100%;
            max-width: 500px;
            margin-top: 50px;
            text-align: center;
          }

          /* Form Styling */
          .form-container {
            background: white;
            border-radius: 10px;
          }

          /* Responsive */
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

export default RequestConsultation;
