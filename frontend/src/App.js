import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/signup";
import StudentDashboard from "./pages/student/StudentDashboard";
import ConsultantDashboard from "./pages/consultant/ConsultantDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Navbar from "./components/Navbar";
import RequestConsultation from "./pages/student/RequestConsultation";
import RequestTeacherConsultation from "./pages/student/RequestTeacherConsultation";
import StudentConsultations from "./pages/consultant/StudentConsultations";
import ConsultationsPage from "./pages/consultant/ConsultationsPage";
import TeacherConsultations from "./pages/teacher/TeacherConsultations";

// ✅ Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return element;
};

// ✅ Layout Component to Handle Navbar Visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />} {/* ✅ Conditionally show Navbar */}
      <div className="container mt-4">{children}</div>
    </>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ✅ Student Routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={["Student"]} />} />
        <Route path="/student-consultations" element={<ProtectedRoute element={<StudentConsultations />} allowedRoles={["Student"]} />} />
        <Route path="/request-consultation" element={<ProtectedRoute element={<RequestConsultation />} allowedRoles={["Student"]} />} />
        <Route path="/request-teacher-consultation" element={<ProtectedRoute element={<RequestTeacherConsultation />} allowedRoles={["Student"]} />} />

        {/* ✅ Consultant Routes */}
        <Route path="/consultant-dashboard" element={<ProtectedRoute element={<ConsultantDashboard />} allowedRoles={["Consultant"]} />} />
        <Route path="/consultations" element={<ProtectedRoute element={<ConsultationsPage />} allowedRoles={["Consultant"]} />} />

        {/* ✅ Teacher Routes */}
        <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} allowedRoles={["Teacher"]} />} />
        <Route path="/teacher-consultations" element={<ProtectedRoute element={<TeacherConsultations />} allowedRoles={["Teacher"]} />} />
      </Routes>
    </Layout>
  );
}

export default App;
