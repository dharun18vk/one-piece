import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"
const Home = () => {
  return (
    <div className="home-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/4911644/4911644-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="welcome-box">
        <h1 className="title">Welcome to the Consultation Hub</h1>
        <p className="subtitle">
          Unlock expert guidance for your academic and professional journey.
        </p>
        
        <div className="button-group">
          <Link to="/login">
            <button className="btn-outline">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn-primary">Signup</button>
          </Link>
        </div>
        <div className="scroll-down-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;