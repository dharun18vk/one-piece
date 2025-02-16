import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth hook

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ Get login function from AuthContext

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post("http://localhost:5000/auth/login", { email, password });


            if (response.data.success) {
                alert("Login successful!");
                login(response.data);
                navigate(response.data.role === "Student" ? "/student-dashboard" : "/consultant-dashboard");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Invalid email or password. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
};

    
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
            <div className="bg-white p-4 rounded shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center text-primary mb-3">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label"><strong>Email</strong></label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        /> 
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><strong>Password</strong></label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-3">Don't have an account?</p>
                <Link to="/signup" className="btn btn-secondary w-100">Sign Up</Link>
            </div>
        </div>
    );
};

export default Login;
