import React, { useState } from "react";

const CreateConsultation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newConsultation = { title, description };

    // Send data to API (Replace with real API)
    await fetch("http://localhost:5000/api/consultations", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConsultation),
    });

    alert("Consultation Created!");
  };

  return (
    <div>
      <h1>Create Consultation</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateConsultation;
