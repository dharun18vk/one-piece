import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RequestConsultation() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
        return;
      }
      const { token } = JSON.parse(storedUser);

      await axios.post(
        "http://localhost:5000/consultations/create",
        { topic, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Consultation request created!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Failed to create consultation:", error);
      alert(error.response?.data?.error || "Error creating consultation. Try again!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Request a Consultation</h2>
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/student-dashboard")}>
        Back to Dashboard
      </button>
      <div className="card p-4 shadow-lg">
        <div className="mb-3">
          <label className="form-label">
            <strong>Topic</strong>
          </label>
          <input
            className="form-control"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <strong>Description</strong>
          </label>
          <textarea
            className="form-control"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          ></textarea>
        </div>

        <button className="btn btn-success w-100" onClick={handleCreate}>
          Submit Request
        </button>
      </div>
    </div>
  );
}

export default RequestConsultation;
