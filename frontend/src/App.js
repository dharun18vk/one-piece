import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/signup";
import StudentDashboard from "./pages/StudentDashboard";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={["Student"]} />} />
            <Route path="/consultant-dashboard" element={<ProtectedRoute element={<ConsultantDashboard />} allowedRoles={["Consultant"]} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
