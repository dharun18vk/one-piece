import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TeacherConsultations() {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultations = async () => {
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
        console.error(error.response?.data?.message || "Error fetching teacher consultations. Try again!");
        alert("Error fetching teacher consultations. Try again!");
      }
    };

    fetchConsultations(); // ✅ Call fetchConsultations inside useEffect
  }, [navigate]); // ✅ Add `navigate` in dependency array

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Teacher Consultations</h2>
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/teacher-dashboard")}>
        Back to Dashboard
      </button>

      {consultations.length > 0 ? (
        <ul className="list-group mt-3">
          {consultations.map((consultation) => (
            <li key={consultation._id} className="list-group-item">
              <strong>{consultation.topic}</strong>
              <p>{consultation.description}</p>
              <p><strong>Student:</strong> {consultation.student?.name || "Unknown"}</p>
              <p><strong>Status:</strong> {consultation.status}</p>
              <p><strong>Reply:</strong> {consultation.reply || "No reply yet"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted mt-3">No teacher consultations available.</p>
      )}
    </div>
  );
}

export default TeacherConsultations;
