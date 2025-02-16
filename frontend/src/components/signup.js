import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Student"); // ✅ Default role is "Student"
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

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
            setLoading(false); // Stop loading
        }
    };

    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
            <div className="bg-white p-4 rounded shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center text-primary mb-3">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label"><strong>Name</strong></label>
                        <input 
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        /> 
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><strong>Email</strong></label>
                        <input 
                            type="email" 
                            placeholder="Enter Email"
                            className="form-control"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        /> 
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><strong>Password</strong></label>
                        <input 
                            type="password" 
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><strong>Role</strong></label>
                        <select 
                            className="form-control"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            required
                        >
                            <option value="Student">Student</option>
                            <option value="Consultant">Consultant</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-3">Already have an account?</p>
                <Link to='/login' className="btn btn-secondary w-100">Login</Link>
            </div>
        </div>
    );
}

export default Signup;
