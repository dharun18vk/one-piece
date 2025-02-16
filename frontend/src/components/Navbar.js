import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth hook

const Navbar = () => {
    const { user, logout } = useAuth(); // ✅ Get user state from AuthContext
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // ✅ Clears user state
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Consultation App</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white">Welcome, {user.role}!</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary ms-2" to="/signup">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
