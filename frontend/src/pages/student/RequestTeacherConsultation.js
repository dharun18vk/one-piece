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
    logout();
    navigate("/login");
  };

  return (
    <div className="main-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/1893746/1893746-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="sidebar-title">Student Menu</h4>
        <button className="sidebar-btn" onClick={() => navigate("/request-consultation")}>
          📝 Request Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-consultations")}>
          📑 View My Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/request-teacher-consultation")}>
          👨‍🏫 Request Teacher Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-dashboard")}>
          🏠 Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="content-container">
        <h2 className="welcome-title">Request a Teacher Consultation</h2>
        <div className="form-card">
          <div className="form-group">
            <label className="form-label"><strong>Topic</strong></label>
            <input
              className="form-input"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><strong>Description</strong></label>
            <textarea
              className="form-input"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>

          <button className="submit-btn" onClick={handleCreate}>
            Submit Request
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
            .content-container {
              flex-grow: 1;
              padding: 20px;
              margin-left: ${isSidebarOpen ? "260px" : "0"};
              transition: margin-left 0.3s ease;
            }
        `}
      </style>
    </div>
  );
}

export default RequestTeacherConsultation;