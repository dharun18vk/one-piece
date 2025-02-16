import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ConsultationForm({ onConsultationCreated }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/consultations/create",
        { topic, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      onConsultationCreated(); // Refresh consultation list
      setTopic("");
      setDescription("");
      alert("Consultation request created successfully!");
    } catch (error) {
      console.error("Failed to create consultation:", error);
      alert("Error creating consultation. Try again!");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary">Request a Consultation</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
        <div className="mb-3">
          <label className="form-label"><strong>Topic</strong></label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label"><strong>Description</strong></label>
          <textarea
            className="form-control"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit Consultation</button>
      </form>
    </div>
  );
}

export default ConsultationForm;
