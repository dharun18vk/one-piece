import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequestConsultation() {
  const { logout } = useAuth();
  const [topic, setTopic] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [description, setDescription] = useState("");
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
    logout(); // ✅ Clears user state
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Request a Consultation</h2>
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
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="card p-4 shadow-lg">
        <div className="mb-3">
          <label className="form-label">
            <strong>Topic</strong>
          </label>
          <input
            className="form-control"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <strong>Description</strong>
          </label>
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
          .menu-btn {
            position: fixed;
            top: 9px;
            left: 15px;
            background:rgb(37, 37, 37);
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 1100;
          }
          .menu-btn:hover {
            background:rgb(0, 0, 0);
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
          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 10px; 
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
          .ms-2 {
            margin-top: auto;
          }
            margin-top: auto;
          }
        `}
      </style>
    </div>
  );
}

export default RequestConsultation;
