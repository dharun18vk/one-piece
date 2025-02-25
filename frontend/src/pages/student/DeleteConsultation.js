import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeleteConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this consultation?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5000/api/consultations/${id}`, {
      method: "DELETE",
    });

    alert("Consultation Deleted!");
    navigate("/consultations");
  };

  return (
    <div>
      <h1>Delete Consultation</h1>
      <p>Are you sure you want to delete this consultation?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
    </div>
  );
};

export default DeleteConsultation;
