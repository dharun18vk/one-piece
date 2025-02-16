import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ConsultantDashboard() {
    const [requests, setRequests] = useState([]);
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

            const res = await axios.get("http://localhost:5000/consultations/all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRequests(res.data);
        } catch (error) {
            console.error("Failed to fetch consultations:", error);
            alert("Error fetching consultations. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary">Consultant Dashboard</h2>
            {requests.length > 0 ? (
                <ul className="list-group mt-3">
                    {requests.map((req) => (
                        <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{req.topic}</strong>
                                <p className="mb-1">{req.description}</p>
                                <small className="text-muted">Requested by: {req.student?.name || "Unknown"}</small>
                            </div>
                            <span className={`badge ${req.status === "Approved" ? "bg-success" : req.status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                                {req.status}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted mt-3">No consultation requests available.</p>
            )}
        </div>
    );
}

export default ConsultantDashboard;
