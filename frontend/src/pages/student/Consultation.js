import React, { useState, useEffect } from "react";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    // Fetch consultations from API (Replace with real API)
    const fetchConsultations = async () => {
      const response = await fetch("http://localhost:5000/api/consultations")
      const data = await response.json();
      setConsultations(data);
    };

    fetchConsultations();
  }, []);

  return (
    <div>
      <h1>Consultations</h1>
      <ul>
        {consultations.map((consultation) => (
          <li key={consultation.id}>
            <h3>{consultation.title}</h3>
            <p>{consultation.description}</p>
            <a href={`/edit-consultation/${consultation.id}`}>Edit</a> | 
            <a href={`/delete-consultation/${consultation.id}`}>Delete</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Consultations;
