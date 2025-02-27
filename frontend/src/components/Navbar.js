import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="custom-navbar">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand" to="/">Consultation App</Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <span className="welcome-text">Welcome, {user.role}!</span>
                            <button className="btn btn-logout ms-2" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="btn btn-signup ms-2" to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            <style>
                {`
                  /* Custom Navbar */
                  .custom-navbar {
                    height: 60px; /* ✅ Reduced height */
                    background: rgba(0, 0, 0, 0);
                    backdrop-filter: blur(10px);
                    padding: 8px 15px; /* ✅ Smaller padding */
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                  }

                  .navbar-brand {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: white !important;
                    transition: color 0.3s ease;
                  }
                  .navbar-brand:hover {
                    color: #00aaff !important;
                  }

                  /* Navbar Links */
                  .nav-links {
                    display: flex;
                    align-items: center;
                  }

                  .nav-link {
                    color: white !important;
                    margin-right: 15px;
                    transition: color 0.3s ease;
                  }
                  .nav-link:hover {
                    color: #00aaff !important;
                  }

                  /* Welcome Text */
                  .welcome-text {
                    color: #f1f1f1;
                    font-weight: 500;
                    padding:50px;
                    align:left;
                  }

                  /* Buttons */
                  .btn-signup {
                    background: #00aaff;
                    color: white;
                    padding: 5px 12px;
                    font-size: 14px;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                  }
                  .btn-signup:hover {
                    background: #0088cc;
                    transform: scale(1.05);
                  }

                  .btn-logout {
                    background: #ff4444;
                    color: white;
                    padding: 5px 12px;
                    font-size: 14px;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    margin-right:auto;
                    display:inline;
                  }
                  .btn-logout:hover {
                    background: #cc0000;
                    transform: scale(1.05);
                  }

                  /* Responsive Design */
                  @media (max-width: 768px) {
                    .custom-navbar {
                      height: 50px;
                      padding: 5px 10px;
                    }
                    .nav-links {
                      flex-direction: row;
                    }
                    .btn-signup, .btn-logout {
                      padding: 4px 10px;
                    }
                  }
                `}
            </style>
        </nav>
    );
};

export default Navbar;
