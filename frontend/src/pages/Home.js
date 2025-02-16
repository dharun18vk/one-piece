import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-gradient">
      <div className="p-5 bg-white shadow-lg rounded">
        <h1 className="text-primary fw-bold">Welcome to the Consultation App</h1>
        <p className="mt-3 text-muted">Easily connect with consultants for your academic and professional needs.</p>
        
        <div className="mt-4">
          <Link to="/login">
            <button className="btn btn-primary me-2">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-outline-primary">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
