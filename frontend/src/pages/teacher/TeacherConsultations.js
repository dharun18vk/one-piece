import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TeacherConsultations() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [expandedConsultation, setExpandedConsultation] = useState(null); // ✅ Track expanded consultation
  const [status, setStatus] = useState({});
  const [replies, setReplies] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch teacher consultations
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

  // ✅ Toggle consultation details
  const toggleConsultationDetails = (consultationId) => {
    setExpandedConsultation(expandedConsultation === consultationId ? null : consultationId);
  };

  // ✅ Handle status change per consultation
  const handleStatusChange = (consultationId, newStatus) => {
    setStatus((prev) => ({ ...prev, [consultationId]: newStatus }));
  };

  // ✅ Handle reply change per consultation
  const handleReplyChange = (consultationId, newReply) => {
    setReplies((prev) => ({ ...prev, [consultationId]: newReply }));
  };

  // ✅ Update consultation status & reply
  const handleUpdate = async (consultationId) => {
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);

      const data = {
        consultationId,
        status: status[consultationId] || "Pending",
        reply: replies[consultationId] || "",
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
      <h2 className="text-center text-primary">Teacher Consultations</h2>
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h4 className="text-center text-light mt-3">Menu</h4>
        <button className="btn btn-primary w-100" onClick={() => navigate("/teacher-consultations")}>
          View Teacher Consultations
        </button>
        <button className="btn btn-primary w-100 mb-4" onClick={() => navigate("/teacher-dashboard")}>
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
                    onClick={() => handleUpdate(consultation._id)}
                  >
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

      {/* Sidebar & Overlay Styles */}
      <style>
        {`
          .dashboard-container {
            position: relative;
          }

          /* Sidebar Toggle Button */
          .menu-btn {
            position: fixed;
            top: 10px; 
            left: 15px;
            background:rgba(0, 123, 255, 0);
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 1100;
            transition: all 0.3s ease-in-out;
          }
          .menu-btn:hover {
            background:rgb(0, 0, 0);
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -250px;
            width: 250px;
            height: 100%;
            background: #343a40;
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 1000;
            display: flex;          /* ✅ Enables flexbox */
            flex-direction: column; /* ✅ Aligns items vertically */
            justify-content: space-between; 
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
          .logout-container {
            margin-top: auto;
          }
        `}
      </style>
    </div>
  );
}

export default TeacherConsultations;
