import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditConsultation = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Fetch consultation details
    const fetchConsultation = async () => {
      const response = await fetch(`http://localhost:5000/api/consultations/${id}`);
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
    };

    fetchConsultation();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedConsultation = { title, description };

    await fetch(`https://api.example.com/consultations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConsultation),
    });

    alert("Consultation Updated!");
  };

  return (
    <div>
      <h1>Edit Consultation</h1>
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditConsultation;
