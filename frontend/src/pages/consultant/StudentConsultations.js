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
  }, []);

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
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-info">Your Consultations</h2>
        
        {consultations.length > 0 ? (
          <ul className="list-group mt-3">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="list-group-item">
                {/* ✅ Click to toggle details */}
                <div className="d-flex justify-content-between align-items-center cursor-pointer" 
                     onClick={() => toggleConsultationDetails(consultation._id)}
                     style={{ cursor: "pointer" }}>
                  <strong>{consultation.topic}</strong>
                  <span className="text-muted">
                    {expandedConsultation === consultation._id ? "▲" : "▼"}
                  </span>
                </div>

                {/* ✅ Show details only when expanded */}
                {expandedConsultation === consultation._id && (
                  <div className="mt-2 p-3 border rounded bg-light">
                    <p><strong>Description:</strong> {consultation.description}</p>
                    <p><strong>Status:</strong> {consultation.status}</p>
                    <p><strong>Consultant's Reply:</strong> {consultation.reply || "No reply yet"}</p>

                    {/* Edit and Delete Buttons */}
                    <button className="btn btn-warning btn-sm mx-2" onClick={() => openModal(consultation)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(consultation._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted mt-3">No consultation requests found.</p>
        )}
      </div>

      {/* ✅ Modal for Editing Consultation */}
      {isEditing && selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Consultation</h3>
            <label>Topic:</label>
            <input type="text" name="topic" value={newConsultation.topic} onChange={handleInputChange} className="form-control" />

            <label>Description:</label>
            <textarea name="description" value={newConsultation.description} onChange={handleInputChange} className="form-control" />

            <button className="btn btn-success mt-2" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary mt-2" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Sidebar & Overlay Styles */}
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
            display: flex;          /* ✅ Enables flexbox */
            flex-direction: column; /* ✅ Aligns items vertically */
            justify-content: space-between; 
            }
          .logout-container {
            margin-top: auto;
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
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            text-align: center;
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
        `}
      </style>
    </div>
  );
}

export default StudentConsultations;
