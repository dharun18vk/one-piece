import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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

  // ✅ Fetch consultations
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

  // ✅ Toggle consultation details
  const toggleConsultationDetails = (consultationId) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
  };

  // ✅ Open edit modal
  const openModal = (consultation) => {
    setSelectedConsultation(consultation);
    setNewConsultation({ topic: consultation.topic, description: consultation.description });
    setIsEditing(true);
  };

  // ✅ Close edit modal
  const closeModal = () => {
    setSelectedConsultation(null);
    setIsEditing(false);
  };

  // ✅ Handle input change in edit modal
  const handleInputChange = (e) => {
    setNewConsultation({ ...newConsultation, [e.target.name]: e.target.value });
  };

  // ✅ Create or Edit Consultation
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

  // ✅ Delete consultation
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
      <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="sidebar-title">Menu</h4>
        <button className="sidebar-btn" onClick={() => navigate("/request-consultation")}>
          Request Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-consultations")}>
          View My Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/request-teacher-consultation")}>
          Request Teacher Consultation
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content container mt-5">
        <h2 className="main-title">Your Consultations</h2>
        {consultations.length > 0 ? (
          <ul className="list-group mt-3">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="list-group-item consultation-card">
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
                      <button className="btn btn-warning btn-sm" onClick={() => openModal(consultation)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(consultation._id)}>
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
            <div className="mb-2">
              <label className="form-label"><strong>Topic:</strong></label>
              <input
                type="text"
                name="topic"
                value={newConsultation.topic}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter topic"
              />
            </div>
            <div className="mb-2">
              <label className="form-label"><strong>Description:</strong></label>
              <textarea
                name="description"
                value={newConsultation.description}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter description"
                rows="3"
              ></textarea>
            </div>
            <button className="btn btn-success w-100" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary w-100 mt-2" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Styles */}
      <style>
        {`
          /* Overall Dashboard Container */
          .dashboard-container {
            background: #0d1117;
            color:black;
            position:flex;
            font-family: 'Poppins', sans-serif;
          }
          body {
            background: #0d1117;
            color: white;
            overflow-x: hidden;
          }
          
          /* Sidebar Styles */
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
          .sidebar-title {
            text-align: center;
            color: #007bff;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .sidebar-btn {
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
          .sidebar-btn:hover {
            background: #007bff;
            color: white;
            transform: scale(1.05);
          }
          .logout-btn {
            border-color: #dc3545;
            color: #dc3545;
          }
          .logout-btn:hover {
            background: #dc3545;
            color: white;
          }

          /* Main Content Styles */
          .main-content {
            margin-left: 0;
            padding: 50px 20px;
          }
          .main-title {
            text-align: center;
            color: #00aaff;
            font-size: 32px;
            margin-bottom: 30px;
          }
          .consultation-list {
            margin-top: 20px;
          }
          .consultation-card {
            background: #1e1e1e;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .consultation-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
          }
          .consultation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color:white;
          }
          .toggle-icon {
            font-size: 18px;
          }
          .consultation-details {
            margin-top: 10px;
            background:rgba(255, 255, 255, 0.89);
            color: #333;
            padding: 10px;
            border-radius: 8px;
          }
          .action-buttons {
            margin-top: 10px;
          }
          .action-buttons .btn {
            margin-right: 10px;
          }
          .no-consultations {
            text-align: center;
            color: #aaa;
            margin-top: 20px;
            font-size: 18px;
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }
          .modal-content {
            background: white;
            color: #333;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          }

          /* Menu Button */
          .menu-btn {
            position: fixed;
            top: 10px;
            left: 15px;
            background: transparent;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 22px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 1100;
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .menu-btn:hover {
            background: rgba(0,0,0,0.3);
            transform: scale(1.1);
          }

          /* Responsive Sidebar */
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

export default StudentConsultations;
