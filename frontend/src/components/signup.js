import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/signup.css"

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/auth/register", { name, email, password, role });

            if (response.data.success) {
                alert("Signup successful! Redirecting to login...");
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("This email is already registered. Try a different email.");
            } else {
                console.error("Signup Error:", error);
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="signup-container">

                <video autoPlay loop muted playsInline className="background-video">
                    <source src="https://cdn.pixabay.com/video/2018/01/06/13704-250154065_large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-signup" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="login-text">Already have an account?</p>
                <Link to='/login' className="btn-login">Login</Link>
            </div>
        </div>
    );
}

export default Signup;