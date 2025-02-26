import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";

function ConsultationsPage() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [expandedConsultation, setExpandedConsultation] = useState(null); // ✅ Track which consultation is expanded
  const [status, setStatus] = useState({});
  const [replies, setReplies] = useState({});
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

  // ✅ Fix: Define handleStatusChange separately
  const handleStatusChange = (consultationId, newStatus) => {
    setStatus((prev) => ({ ...prev, [consultationId]: newStatus }));
  };

  // ✅ Fix: Define handleReplyChange separately
  const handleReplyChange = (consultationId, newReply) => {
    setReplies((prev) => ({ ...prev, [consultationId]: newReply }));
  };

  // ✅ Update consultation with independent replies
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
        status: status[consultationId] || "Pending", // ✅ Ensure valid status
        reply: replies[consultationId] || "", // ✅ Ensure reply is a string
        recipientType,
      };

      console.log("Sending update request:", data); // ✅ Debugging step

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
    <div className="container mt-5">
      <h2 className="text-center text-primary">Consultations</h2>
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="text-center text-light mt-3">Menu</h4>
        <button className="btn btn-primary w-100" onClick={() => navigate("/consultations")}>
          View Consultations
        </button>
        <button className="btn btn-primary w-100 mt-2" onClick={() => navigate("/consultant-dashboard")}>
          Back to Dashboard
        </button>
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {consultations.length > 0 ? (
        <ul className="list-group mt-3">
          {consultations.map((consultation) => (
            <li key={consultation._id} className="list-group-item">
              {/* ✅ Click to toggle details */}
              <div 
                className="d-flex justify-content-between align-items-center cursor-pointer" 
                onClick={() => toggleConsultationDetails(consultation._id)}
                style={{ cursor: "pointer" }}
              >
                <strong>{consultation.topic}</strong>
                <span className="text-muted">
                  {expandedConsultation === consultation._id ? "▲" : "▼"}
                </span>
              </div>

              {/* ✅ Show details only when expanded */}
              {expandedConsultation === consultation._id && (
                <div className="mt-2 p-3 border rounded bg-light">
                  <p><strong>Description:</strong> {consultation.description}</p>
                  <p><strong>Student:</strong> {consultation.student?.name || "Unknown"}</p>
                  <p><strong>Status:</strong> {consultation.status}</p>
                  <p><strong>Reply:</strong> {consultation.reply || "No reply yet"}</p>

                  {/* Status Dropdown */}
                  <select
                    className="form-control my-2"
                    value={status[consultation._id] || consultation.status}
                    onChange={(e) => handleStatusChange(consultation._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Reply Input Field */}
                  <textarea
                    className="form-control my-2"
                    placeholder="Write a reply..."
                    value={replies[consultation._id] || ""}
                    onChange={(e) => handleReplyChange(consultation._id, e.target.value)}
                  ></textarea>

                  {/* Update Button */}
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
          .sidebar.open {
            left: 0;
          }
          .logout-container {
            margin-top: auto;
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
        `}
      </style>
    </div>
  );
}

export default ConsultationsPage;
