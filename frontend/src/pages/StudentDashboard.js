import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [consultations, setConsultations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                alert("You are not logged in!");
                navigate("/login");
                return;
            }

            const user = JSON.parse(storedUser);
            const token = user.token;

            const res = await axios.get("http://localhost:5000/consultations/student", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setConsultations(res.data);
        } catch (error) {
            console.error("Failed to fetch consultations:", error);
            alert("Error fetching consultations. Please try again.");
        }
    };

    const handleCreate = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                alert("Unauthorized: Please log in again.");
                navigate("/login");
                return;
            }

            const user = JSON.parse(storedUser);
            const token = user.token;

            const response = await axios.post(
                "http://localhost:5000/consultations/create",
                { topic, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Consultation request created!");
            setTopic("");
            setDescription("");
            fetchConsultations(); // ✅ Refresh list
        } catch (error) {
            console.error("Failed to create consultation:", error);
            alert(error.response?.data?.error || "Error creating consultation. Try again!");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success">Student Dashboard</h2>

            <div className="card p-4 shadow-lg">
                <h4>Request a Consultation</h4>
                <div className="mb-3">
                    <label className="form-label"><strong>Topic</strong></label>
                    <input
                        className="form-control"
                        placeholder="Enter topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
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
                    ></textarea>
                </div>

                <button className="btn btn-primary w-100" onClick={handleCreate}>Request Consultation</button>
            </div>

            <h3 className="mt-5">Your Consultations:</h3>
            {consultations.length > 0 ? (
                <ul className="list-group mt-3">
                    {consultations.map((consultation) => (
                        <li key={consultation._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{consultation.topic}</strong>
                                <p className="mb-1">{consultation.status}</p>
                            </div>
                            <span className={`badge ${consultation.status === "Approved" ? "bg-success" : consultation.status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                                {consultation.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted mt-3">No consultation requests found.</p>
            )}
        </div>
    );
}

export default StudentDashboard;
