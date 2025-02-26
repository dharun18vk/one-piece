import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";

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
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <br></br>
          <br></br>
          <h3 className="text-light">Consultant Panel</h3>
        </div>
          <button className="btn btn-light-blue w-100" onClick={() => navigate("/consultations")}>
            🔍 View Consultations
          </button>
          <button className="btn btn-light-blue w-100 mt-2" onClick={() => navigate("/consultant-dashboard")}>Back to Dashboard</button>
        <div className="logout-container">
          <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-primary">Consultations</h2>
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>

        {consultations.length > 0 ? (
          <ul className="list-group mt-3">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="list-group-item">
                <div
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => toggleConsultationDetails(consultation._id)}
                >
                  <strong>{consultation.topic}</strong>
                  <span className="text-muted">
                    {expandedConsultation === consultation._id ? "▲" : "▼"}
                  </span>
                </div>

                {expandedConsultation === consultation._id && (
                  <div className="mt-2 p-3 border rounded bg-light">
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
          /* General Styling */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
          }

          body {
            background: #0d1117;
            color: white;
            overflow-x: hidden;
          }

          .dashboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          /* Sidebar */
          .sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            padding: 20px;
            transition: left 0.3s ease-in-out;
            z-index: 1000;
            border-right: 2px solid rgba(255, 255, 255, 0.1);
          }
          .sidebar.open {
            left: 0;
          }

          /* Sidebar Overlay */
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
            transition: all 0.3s ease-in-out;
            border-radius: 10px;
            padding: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .btn-primary {
            background:rgb(0, 170, 255);
            border: none;
          }
          .btn-warning {
            background: #ffcc00;
            border: none;
          }
          .btn:hover {
            transform: scale(1.1);
            box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
          }

          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 10px;
            left:2px;
            background: transparent;
            color: white;
            border: none;
            padding: 12px 18px;
            font-size: 22px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 1100;
            transition: all 0.3s ease-in-out;
          }
          .menu-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            transform: scale(1.1);
            radius:50%;
          }

          /* Welcome Text */
          .dashboard-content {
            padding: 50px;
            text-align: center;
            width: 100%;
            max-width: 800px;
          }

          .title-text {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            text-shadow: 2px 2px 10px rgba(0, 123, 255, 0.5);
          }

          .subtitle-text {
            font-size: 18px;
            color: #ddd;
            margin-top: 10px;
          }

          /* Responsive Design */
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

export default ConsultationsPage;
