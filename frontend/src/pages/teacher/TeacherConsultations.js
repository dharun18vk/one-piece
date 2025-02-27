import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TeacherConsultations() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [expandedConsultation, setExpandedConsultation] = useState(null);
  const [status, setStatus] = useState({});
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();

  const fetchConsultations = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
        return;
      }
      const { token } = JSON.parse(storedUser);

      const res = await axios.get("http://localhost:5000/consultations/teacher-consultations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConsultations(res.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching teacher consultations.");
      alert("Error fetching teacher consultations. Try again!");
    }
  }, [navigate]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const toggleConsultationDetails = (consultationId) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
  };

  const handleStatusChange = (consultationId, newStatus) => {
    setStatus((prev) => ({ ...prev, [consultationId]: newStatus }));
  };

  const handleReplyChange = (consultationId, newReply) => {
    setReplies((prev) => ({ ...prev, [consultationId]: newReply }));
  };

  const handleUpdate = async (consultationId) => {
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);

      const data = {
        consultationId,
        status: status[consultationId] || "Pending",
        reply: replies[consultationId] || "",
      };

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
        <br></br>
        <br></br>
          <h3 className="text-light">Teacher Panel</h3>
        </div>
        <button className="btn btn-light-blue w-100" onClick={() => navigate("/teacher-consultations")}>
          View Consultations
        </button>
        <button className="btn btn-light-blue w-100 mt-2" onClick={() => navigate("/teacher-dashboard")}>
          Back to Dashboard
        </button>

        {/* Logout Button (Moved to Bottom) */}
        <div className="logout-container">
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {consultations.length > 0 ? (
        <ul className="list-group mt-3">
          {consultations.map((consultation) => (
            <li key={consultation._id} className="list-group-item">
              <div
                className="d-flex justify-content-between align-items-center"
                onClick={() => toggleConsultationDetails(consultation._id)}
                style={{ cursor: "pointer" }}
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

                  <button className="btn btn-success" onClick={() => handleUpdate(consultation._id)}>
                    Update Status & Send Reply
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted mt-3">No teacher consultations available.</p>
      )}

      {/* Sidebar & Logout Styles */}
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
            display: inline;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

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
            justify-content: space-between;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
          }
          .sidebar.open {
            left: 0;
          }
          .logout-container {
            margin-top: auto;
            padding-bottom: 10px;
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

          /* Sidebar Buttons */
          .btn {
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
          .btn-logout {
            background:rgba(0, 0, 0, 0);
            border: 2px solid #cc0000;
            color: white;
            padding: 10px;
            width: 100%;
            font-size: 16px;
            border-radius: 8px;
            transition: background 0.3s ease, transform 0.3s ease;
            cursor: pointer;
          }
          .btn-logout:hover {
            background: #cc0000;
            transform: scale(1.05);
          }
          .btn-primary {
            background:rgb(0, 0, 0);
            border: none;
          }
          .btn-warning {
            background: #ffcc00;
            border: none;
          
          }
          
          .btn:hover{
            background:rgb(47, 73, 221)
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

          /* Dashboard Cards */
          .dashboard-card {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            text-align: center;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            color: white;
          }

          .dashboard-card h4 {
            font-size: 18px;
            font-weight: 600;
            color: #ccc;
          }

          .dashboard-card .count {
            font-size: 24px;
            font-weight: bold;
            color: #00aaff;
            margin-top: 10px;
          }


          /* Responsive Design */
          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
          @media (max-width: 576px) {
            .row {
              flex-direction: column;
              align-items: center;
            }
            .col-md-4 {
              width: 80%;
              margin-bottom: 15px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default TeacherConsultations;
