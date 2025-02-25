import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";

function ConsultationsPage() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch consultations with useCallback to prevent re-creation
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

  const handleUpdate = async (consultationId, recipientType) => {
    try {
      const storedUser = localStorage.getItem("user");
      const { token } = JSON.parse(storedUser);
  
      const data = { consultationId, status, reply, recipientType }; // Ensure recipientType is included
  
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
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const handleLogout = () => {
    logout(); // ✅ Clears user state
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Consultations</h2>
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ 
      </button>

      {/* Sidebar Overlay (Closes sidebar when clicked) */}
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
        <button className="btn btn-danger ms-2" onClick={handleLogout}>
          Logout
        </button>
      </div>

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

              <button 
                className="btn btn-success" 
                onClick={() => handleUpdate(consultation._id, consultation.recipientType)}
              >
                Update Status & Send Reply
              </button>

            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted mt-3">No consultation requests available.</p>
      )}
          <style>
        {`
          /* Full Page Styling */
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }

          /* Dashboard Container */
          .dashboard-container {
            position: relative;
            min-height: 100vh;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease-in-out;
          }

          /* Sidebar */
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
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Pushes Logout button to the bottom */
            height: 100vh; /* Full height */
            padding-bottom: 20px; /* Space at bottom */
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
            border-radius: 8px;
            padding: 10px;
            font-weight: bold;
          }
          .btn:hover {
            filter: brightness(90%);
            transform: scale(1.05);
          }

          /* Close Button */
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
          .close-btn:hover {
            color: #ff4757;
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
            transform: scale(1.1);
          }

          /* Main Dashboard Content */
          .dashboard-content {
            padding: 50px;
            text-align: center;
            width: 100%;
            max-width: 800px;
          }

          /* Responsive Fix */
          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
            }
          }
          .ms-2 {
            margin-top: auto;
          }
        `}
      </style>
    </div>
  );
}

export default ConsultationsPage;
