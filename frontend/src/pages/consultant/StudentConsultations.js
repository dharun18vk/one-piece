import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

      {/* Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
          }

          body {
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)),
              url('https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
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
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.1);
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
            background: rgba(255, 255, 255, 0.2);
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
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }

          .welcome-title {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
            color: #00aaff;
          }

          .consultation-list {
            list-style: none;
            padding: 0;
            max-width: 800px;
            margin: 0 auto;
          }

          .consultation-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .consultation-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .consultation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .toggle-icon {
            font-size: 18px;
          }

          .consultation-details {
            margin-top: 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }

          .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          .btn-edit, .btn-delete, .btn-save, .btn-cancel {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-edit {
            background: #ffcc00;
            color: black;
          }

          .btn-delete {
            background: #dc3545;
            color: white;
          }

          .btn-save {
            background: #00aaff;
            color: white;
          }

          .btn-cancel {
            background: #6c757d;
            color: white;
          }

          .btn-edit:hover, .btn-delete:hover, .btn-save:hover, .btn-cancel:hover {
            transform: translateY(-2px);
          }

          .no-consultations {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 20px;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }

          .modal-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-label {
            font-size: 1rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
          }

          .form-input {
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 1rem;
            transition: border-color 0.3s ease, background 0.3s ease;
          }

          .form-input:focus {
            border-color: #00aaff;
            background: rgba(255, 255, 255, 0.1);
            outline: none;
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

export default StudentConsultations;