import React from "react";
import { Link } from "react-router-dom";

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

      <style>
        {`
          /* Prevent Scrolling */
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          .background-video {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            z-index: -1;
          }

          /* Background Image (Fixed & Fullscreen) */
          .home-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') 
                        no-repeat center center/cover;
            background-attachment: fixed;
            position: fixed;
            top: 0;
            left: 0;
            color: white; /* Default text color */
          }

          /* Welcome Box */
          .welcome-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 50px;
            z-index: 2;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
            max-width: 600px;
            width: 90%;
          }

          /* Title */
          .title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
          }

          /* Subtitle */
          .subtitle {
            font-size: 1.3rem;
            margin-bottom: 40px;
            line-height: 1.6;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }

          /* Buttons */
          .button-group {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 30px;
          }

          .btn-primary {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border: none;
            padding: 14px 30px;
            font-size: 18px;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
          .btn-primary:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .btn-outline {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.7);
            color: white;
            padding: 14px 30px;
            font-size: 18px;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
          }
          .btn-outline:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: white;
            transform: translateY(-5px);
          }

          /* Responsive Fixes */
          @media (max-width: 768px) {
            .welcome-box {
              padding: 30px;
            }
            .title {
              font-size: 2.5rem;
            }
            .subtitle {
              font-size: 1.1rem;
            }
            .button-group {
              flex-direction: column;
              gap: 15px;
            }
          }

          /* Scroll Down Indicator */
          .scroll-down-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            cursor: pointer;
            animation: bounce 2s infinite;
          }

          .scroll-down-indicator svg {
            width: 30px;
            height: 30px;
            stroke: white;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Home;