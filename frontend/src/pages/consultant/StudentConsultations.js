import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function StudentConsultations() {
  const [consultations, setConsultations] = useState([]);
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

  // ✅ Open modal for editing
  const openModal = (consultation) => {
    setSelectedConsultation(consultation);
    setNewConsultation({ topic: consultation.topic, description: consultation.description });
    setIsEditing(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setSelectedConsultation(null);
    setIsEditing(false);
  };

  // ✅ Handle input change for new consultations
  const handleInputChange = (e) => {
    setNewConsultation({ ...newConsultation, [e.target.name]: e.target.value });
  };

  // ✅ Create or Edit Consultation
  const handleSave = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);

      if (isEditing) {
        await axios.put(
          `http://localhost:5000/consultations/update/${selectedConsultation._id}`,
          newConsultation,
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

  // ✅ Sidebar toggle functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Open Menu
      </button>

      {/* Sidebar Overlay (Closes sidebar when clicked) */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✖</button>
        <h4 className="text-center text-light mt-3">Menu</h4>

        {/* Back to Dashboard Button */}
        <button className="btn btn-secondary w-100 mb-3" onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>

        {/* Create Consultation Button */}
        <button className="btn btn-primary w-100 mb-3" onClick={() => setIsEditing(false) || setSelectedConsultation({ topic: "", description: "" })}>
          Create Consultation
        </button>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-info">Your Consultations</h2>

        {consultations.length > 0 ? (
          <ul className="list-group mt-3">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="list-group-item">
                <strong>{consultation.topic}</strong>
                <p className="mb-1">{consultation.description}</p>
                <p><strong>Status:</strong> {consultation.status}</p>
                <p><strong>Consultant's Reply:</strong> {consultation.reply || "No reply yet"}</p>

                {/* Edit and Delete Buttons */}
                <button className="btn btn-warning btn-sm mx-2" onClick={() => openModal(consultation)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(consultation._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted mt-3">No consultation requests found.</p>
        )}
      </div>

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
            top: 15px;
            left: 15px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 1100;
          }
          .menu-btn:hover {
            background: #0056b3;
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
