import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
import "../../styles/consultant/ConsultationsPage.css";

function ConsultationsPage() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [expandedConsultation, setExpandedConsultation] = useState(null);
  const [status, setStatus] = useState({});
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch consultations securely
  const fetchConsultations = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You are not logged in!");
        navigate("/login");
        return;
      }
      const { token } = JSON.parse(storedUser);

      const res = await axios.get("http://localhost:5000/consultations/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length === 0) {
        alert("No consultations found!");
      }

      setConsultations(res.data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
      alert("Error fetching consultations. Please try again.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ✅ Toggle consultation details
  const toggleConsultationDetails = (consultationId) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
  };

  // ✅ Handle status & reply change
  const handleStatusChange = (consultationId, newStatus) => {
    setStatus((prev) => ({ ...prev, [consultationId]: newStatus }));
  };

  const handleReplyChange = (consultationId, newReply) => {
    setReplies((prev) => ({ ...prev, [consultationId]: newReply }));
  };

  // ✅ Update consultation status & reply
  const handleUpdate = async (consultationId, recipientType) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("User not authenticated!");
        return;
      }

      const { token } = JSON.parse(storedUser);

      const data = {
        consultationId,
        status: status[consultationId] || "Pending",
        reply: replies[consultationId] || "",
        recipientType,
      };

      console.log("Sending update request:", data);

      await axios.put("http://localhost:5000/consultations/update-status-reply", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Consultation updated successfully!");
      fetchConsultations();
    } catch (error) {
      console.error("Error updating consultation:", error.response?.data || error);
      alert("Failed to update consultation. Try again!");
    }
  };

  // ✅ Sidebar controls
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <div className="dashboard-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src="https://videos.pexels.com/video-files/4063585/4063585-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
          <button className="sidebar-btn" onClick={() => navigate("/consultations")}>
            🔍 View Consultations
          </button>
          <button className="sidebar-btn" onClick={() => navigate("/consultant-dashboard")}>
            Back to Dashboard
          </button>
          <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          logout
        </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="text-center text-primary">Consultations</h2>
          <button className="menu-btn" onClick={toggleSidebar}>☰</button>

          {consultations.length > 0 ? (
            <ul className="consultations-flex">
              {consultations.map((consultation) => (
                <li key={consultation._id} className="consultation-card">
                  <div
                    className="consultation-header"
                    onClick={() => toggleConsultationDetails(consultation._id)}
                  >
                    <strong>{consultation.topic}</strong>
                    <span className="text-muted">
                      {expandedConsultation === consultation._id ? "▲" : "▼"}
                    </span>
                  </div>

                  {expandedConsultation === consultation._id && (
                    <div className="consultation-details">
                      <p><strong>Description:</strong> {consultation.description}</p>
                      <p><strong>Student:</strong> {consultation.student?.name || "Unknown"}</p>
                      <p><strong>Status:</strong> {consultation.status}</p>
                      <p><strong>Reply:</strong> {consultation.reply || "No reply yet"}</p>

                      <select
                        className="form-control my-2"
                        value={status[consultation._id] || consultation.status}
                        onChange={(e) => handleStatusChange(consultation._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <textarea
                        className="form-control my-2"
                        placeholder="Write a reply..."
                        value={replies[consultation._id] || ""}
                        onChange={(e) => handleReplyChange(consultation._id, e.target.value)}
                      ></textarea>

                      <button 
                        className="btn btn-success" 
                        onClick={() => handleUpdate(consultation._id, consultation.recipientType)}
                      >
                        Update Status & Send Reply
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted mt-3">No consultation requests available.</p>
          )}
        </div>

      {/* Sidebar Styles */}
      <style>
        {`
          .main-content {
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

export default ConsultationsPage;
