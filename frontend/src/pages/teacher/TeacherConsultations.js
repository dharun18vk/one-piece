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
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/4063585/4063585-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sidebar Toggle Button */}
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar & Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3 className="sidebar-title">Teacher Panel</h3>
        <button className="sidebar-btn" onClick={() => navigate("/teacher-consultations")}>
          📝 View Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/teacher-dashboard")}>
          🏠 Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="welcome-title">Welcome, Teacher!</h2>
        <p className="welcome-subtitle">Manage your consultations and replies here.</p>

        {consultations.length > 0 ? (
          <div className="consultations-flex">
            {consultations.map((consultation) => (
              <div key={consultation._id} className="consultation-card">
                <div
                  className="consultation-header"
                  onClick={() => toggleConsultationDetails(consultation._id)}
                >
                  <h4>{consultation.topic}</h4>
                  <span>{expandedConsultation === consultation._id ? "▲" : "▼"}</span>
                </div>

                {expandedConsultation === consultation._id && (
                  <div className="consultation-details">
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
              </div>
            ))}
          </div>
        ) : (
          <p className="no-consultations">No consultations available.</p>
        )}
      </div>

      {/* Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          .background-video {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: -1;
          }

          .dashboard-container {
            display: flex;
            min-height: 100vh;
          }

          .menu-btn {
            position: fixed;
            top: 5px;
            left: 20px;
            background: rgba(255, 255, 255, 0);
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
            left: 280px;
          }

          .menu-btn:hover {
            background: rgba(255, 255, 255, 0);
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

          .sidebar-title {
            color: black;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .sidebar-btn {
            background: rgba(0, 0, 0, 0.49);
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
            background: rgb(0, 0, 0);
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
            backdrop-filter: blur(15px);
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }

          .welcome-title {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 10px;
          }

          .welcome-subtitle {
            font-size: 1.2rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 40px;
          }

          .consultations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }

          .consultation-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .consultation-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .consultation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
          }

          .consultation-header h4 {
            font-size: 1.2rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }

          .consultation-details {
            margin-top: 10px;
          }

          .no-consultations {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
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
              left: calc(100% - 60px);
            }
          }
        `}
      </style>
    </div>
  );
}

export default TeacherConsultations;