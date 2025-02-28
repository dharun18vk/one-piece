import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/consultant/StudentConsultations.css";

function StudentConsultations() {
  const { logout } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [expandedConsultation, setExpandedConsultation] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newConsultation, setNewConsultation] = useState({ topic: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch consultations
  const fetchConsultations = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You are not logged in!");
        navigate("/login");
        return;
      }
      const { token } = JSON.parse(storedUser);
      const res = await axios.get("http://localhost:5000/consultations/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(res.data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
      alert("Error fetching consultations. Please try again.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // Toggle consultation details
  const toggleConsultationDetails = (consultationId) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
  };

  // Open edit modal
  const openModal = (consultation) => {
    setSelectedConsultation(consultation);
    setNewConsultation({ topic: consultation.topic, description: consultation.description });
    setIsEditing(true);
  };

  // Close edit modal
  const closeModal = () => {
    setSelectedConsultation(null);
    setIsEditing(false);
  };

  // Handle input change in edit modal
  const handleInputChange = (e) => {
    setNewConsultation({ ...newConsultation, [e.target.name]: e.target.value });
  };

  // Create or Edit Consultation
  const handleSave = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("User not authenticated!");
        return;
      }
      const { token } = JSON.parse(storedUser);
      const updatedConsultation = {
        topic: newConsultation.topic,
        description: newConsultation.description,
        status: selectedConsultation.status,
        recipientType: selectedConsultation.recipientType,
        consultant: selectedConsultation.consultant,
        reply: selectedConsultation.reply || "",
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/consultations/update/${selectedConsultation._id}`,
          updatedConsultation,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Consultation updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/consultations/create",
          newConsultation,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Consultation created successfully!");
      }
      fetchConsultations();
      closeModal();
    } catch (error) {
      console.error("Error saving consultation:", error);
      alert("Failed to save consultation. Try again!");
    }
  };

  // Delete consultation
  const handleDelete = async (consultationId) => {
    if (!window.confirm("Are you sure you want to delete this consultation?")) return;
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);
      await axios.delete(`http://localhost:5000/consultations/delete/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Consultation deleted successfully!");
      fetchConsultations();
    } catch (error) {
      console.error("Error deleting consultation:", error);
      alert("Failed to delete consultation. Try again!");
    }
  };

  return (
    <div className="dashboard-container">

      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/26208370/11939980_640_360_60fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Sidebar Toggle Button */}
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="sidebar-title">Menu</h4>
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
        <button className="sidebar-btn logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="welcome-title">Your Consultations</h2>
        {consultations.length > 0 ? (
          <ul className="consultation-list">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="consultation-card">
                <div
                  className="consultation-header"
                  onClick={() => toggleConsultationDetails(consultation._id)}
                >
                  <strong>{consultation.topic}</strong>
                  <span className="toggle-icon">
                    {expandedConsultation === consultation._id ? "▲" : "▼"}
                  </span>
                </div>
                {expandedConsultation === consultation._id && (
                  <div className="consultation-details">
                    <p><strong>Description:</strong> {consultation.description}</p>
                    <p><strong>Status:</strong> {consultation.status}</p>
                    <p>
                      <strong>Consultant's Reply:</strong> {consultation.reply || "No reply yet"}
                    </p>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => openModal(consultation)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(consultation._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-consultations">No consultation requests found.</p>
        )}
      </div>

      {/* Modal for Editing Consultation */}
      {isEditing && selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Consultation</h3>
            <div className="form-group">
              <label className="form-label"><strong>Topic:</strong></label>
              <input
                type="text"
                name="topic"
                value={newConsultation.topic}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter topic"
              />
            </div>
            <div className="form-group">
              <label className="form-label"><strong>Description:</strong></label>
              <textarea
                name="description"
                value={newConsultation.description}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter description"
                rows="3"
              ></textarea>
            </div>
            <button className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="btn-cancel" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentConsultations;