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

export default ConsultationsPage;
