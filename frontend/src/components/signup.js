import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

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

            <style>
                {`
                    .signup-container {
                        width: 100vw;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.pexels.com/photos/1480807/pexels-photo-1480807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1') no-repeat center center/cover;
                        background-attachment: fixed;
                        position: fixed;
                        top: 0;
                        left: 0;
                        color: white;
                    }

                    .signup-box {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(15px);
                        border-radius: 20px;
                        padding: 30px;
                        z-index: 2;
                        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);
                        width: 400px;
                        text-align: center;

                    }

                    .signup-title {
                        font-size: 2.5rem;
                        font-weight: 700;

                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
                    }

                    .input-group {
                        text-align: left;
                    }

                    .input-group label {
                        font-size: 1.1rem;
                        font-weight: 600;
                        display: block;
                    }

                    .input-group input, .input-group select {
                        width: 100%;
                        padding: 14px;
                        border: 1px solid rgba(0, 0, 0, 0.3);
                        border-radius: 10px;
                        background: rgba(0, 0, 0, 0.2);
                        color: black
                        font-size: 16px;
                        transition: border-color 0.3s ease;
                    }

                    .input-group input::placeholder {
                        color: rgba(255, 255, 255, 0.7);
                    }

                    .input-group input:focus, .input-group select:focus {
                        outline: none;
                        border-color: #00aaff;
                        box-shadow: 0 0 10px rgba(0, 170, 255, 0.4);
                    }

                    .btn-signup {
                        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                        color: white;
                        padding: 16px 30px;
                        font-size: 18px;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        width: 100%;
                        margin-top: 20px;
                    }

                    .btn-signup:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
                    }

                    .login-text {
                        margin-top: 30px;
                        font-size: 1rem;
                    }

                    .btn-login {
                        display: inline-block;
                        margin-top: 15px;
                        padding: 12px 25px;
                        border: 2px solid rgba(255, 255, 255, 0.7);
                        color: white;
                        text-decoration: none;
                        border-radius: 10px;
                        transition: background-color 0.3s ease, border-color 0.3s ease;
                    }

                    .btn-login:hover {
                        background: rgba(255, 255, 255, 0.15);
                        border-color: white;
                    }
                `}
            </style>
        </div>
    );
}

export default Signup;