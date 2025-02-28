import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function TeacherDashboard() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ studentsHelped: 0, activeConsultations: 0, avgRating: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      const data = { studentsHelped: 152, activeConsultations: 12, avgRating: 4.8 };
      setStats(data);
    }
    fetchStats();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://videos.pexels.com/video-files/4063585/4063585-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button className={`menu-btn ${isSidebarOpen ? "shift-right" : ""}`} onClick={toggleSidebar}>
        ☰
      </button>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h3 className="sidebar-title">Teacher Panel</h3>
        <button className="sidebar-btn" onClick={() => navigate("/teacher-consultations")}>
          👨‍🏫 Consultations
        </button>
        <button className="sidebar-btn" onClick={() => navigate("/teacher-dashboard")}>
          🏠 Back to Dashboard
        </button>
        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <h2 className="welcome-title">Welcome, Teacher!</h2>
        <p className="welcome-subtitle">Manage consultations, student requests, and your profile.</p>

        <div className="stats-grid">
          <div className="stats-card">
              <h4>👨‍🎓 Students Helped</h4>
              <p className="count">{stats.studentsHelped}</p>
          </div>
          <div className="stats-card">
              <h4>📅 Active Consultations</h4>
              <p className="count">{stats.activeConsultations}</p>
          </div>
          <div className="stats-card">
              <h4>⭐ Avg. Rating</h4>
              <p className="count">{stats.avgRating} / 5</p>
          </div>
        </div>
      </div>

      {/* Updated Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
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

          body {
            background: linear-gradient(rgba(0, 0, 0, 0), rgba(82, 24, 24, 0)),
              url('https://images.pexels.com/photos/3473569/pexels-photo-3473569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
                no-repeat center center/cover;
            background-attachment: fixed;
            color: white;
          }

          .dashboard-container {
            display: flex;
            min-height: 100vh;
          }

          .menu-btn {
            position: fixed;
            top: 5px;
            left: 20px;
            background: rgba(255, 255, 255, 0);
            border: none;
            color: white;
            padding: 12px;
            font-size: 24px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .menu-btn.shift-right {
            left: 280px; /* Adjust based on sidebar width */
          }

          .menu-btn:hover {
            background: rgba(255, 255, 255, 0);
            transform: scale(1.1);
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: -260px;
            width: 260px;
            height: 100vh;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 20px;
            transition: left 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
          }

          .sidebar.open {
            left: 0;
          }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
          }

          .sidebar-overlay.show {
            display: block;
          }

          .sidebar-title {
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .sidebar-btn {
            background: rgba(0, 0, 0, 0.3);
            border: none;
            color: white;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;  
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .sidebar-btn:hover {
            background: rgba(34, 34, 34, 0.33);
            transform: translateX(5px);
          }

          .logout-btn {
            margin-top: auto;
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.5);
          }

          .logout-btn:hover {
            background: rgba(255, 0, 0, 0.2);
          }

          .main-content {
            flex-grow: 1;
            padding: 20px;
            height:300px; 
            backdrop-filter:blur(15px);
            margin-left: ${isSidebarOpen ? "260px" : "0"};
            transition: margin-left 0.3s ease;
          }

          .welcome-title {
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 10px;
          }

          .welcome-subtitle {
            font-size: 1.2rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 40px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .stats-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }

          .stats-card h4 {
            font-size: 1.2rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 10px;
          }

          .stats-card .count {
            font-size: 2rem;
            font-weight: 600;
            color: #00aaff;
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 100%;
              left: -100%;
            }

            .sidebar.open {
              left: 0;
            }

            .main-content {
              margin-left: 0;
            }

            .menu-btn.shift-right {
              left: calc(100% - 60px); /* Adjust for mobile */
            }
          }
        `}
      </style>
    </div>
  );
}

export default TeacherDashboard;
