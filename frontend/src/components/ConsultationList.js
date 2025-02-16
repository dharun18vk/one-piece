import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ConsultationList() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/consultations/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setConsultations(response.data);
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-success">Consultation Requests</h2>
      {consultations.length > 0 ? (
        <ul className="list-group mt-3">
          {consultations.map((consultation) => (
            <li key={consultation._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{consultation.topic}</strong>
                <p className="mb-1">{consultation.description}</p>
                <small className="text-muted">Requested by: {consultation.student?.name || "Unknown"}</small>
              </div>
              <span className={`badge ${consultation.status === "Approved" ? "bg-success" : consultation.status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                {consultation.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted mt-3">No consultations available.</p>
      )}
    </div>
  );
}

export default ConsultationList;
