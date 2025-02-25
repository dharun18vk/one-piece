import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
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

  // ✅ Fetch consultations on component mount
  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ✅ Handle updating consultation status & reply
  const handleUpdate = async (consultationId) => {
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);

      const data = { consultationId, status, reply };

      await axios.put("http://localhost:5000/consultations/update-status-reply", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Consultation updated successfully!");
      fetchConsultations();
    } catch (error) {
      console.error("Error updating consultation:", error);
      alert("Failed to update consultation. Try again!");
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
        ☰
      </button>

      {/* Sidebar Overlay (Closes sidebar when clicked) */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>✖</button>
        <h4 className="text-center text-light mt-3">Menu</h4>

        {/* Back to Dashboard Button */}
        <button className="btn btn-secondary w-100 mb-3" onClick={() => navigate("/consultant-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="container mt-5">
        <h2 className="text-center text-primary">Consultations</h2>

        {consultations.length > 0 ? (
          <ul className="list-group mt-3">
            {consultations.map((consultation) => (
              <li key={consultation._id} className="list-group-item">
                <strong>{consultation.topic}</strong>
                <p>{consultation.description}</p>
                <p><strong>Student:</strong> {consultation.student?.name || "Unknown"}</p>
                <p><strong>Status:</strong> {consultation.status}</p>
                <p><strong>Reply:</strong> {consultation.reply || "No reply yet"}</p>

                {/* Dropdown for status update */}
                <select className="form-control my-2" onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Textarea for reply */}
                <textarea
                  className="form-control my-2"
                  placeholder="Write a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                ></textarea>

                <button className="btn btn-success" onClick={() => handleUpdate(consultation._id)}>
                  Update Status & Send Reply
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted mt-3">No consultation requests available.</p>
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
            top: 9px;
            left: 15px;
            background:rgb(34, 34, 34);
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
