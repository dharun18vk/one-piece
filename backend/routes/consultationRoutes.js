import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createConsultation,
  getStudentConsultations,
  getAllConsultations,
  updateConsultationStatus,
  updateConsultation,      // New: For students to edit their consultation
  deleteConsultation,
  createTeacherConsultation,
  getTeacherConsultations,
  updateStatusReply,
  getStudentStats
} from "../controllers/consultationController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import Consultation from "../models/Consultation.js";


const router = express.Router();

// ✅ Create a consultation (Students only)
router.post("/create", authMiddleware, createConsultation);

// ✅ Get consultations for a student
router.get("/student", authMiddleware, getStudentConsultations);

// ✅ Get all consultations (For consultants only)
router.get("/all", authMiddleware, getAllConsultations);

// ✅ Update consultation status (Consultants only)
router.put("/update-status", authMiddleware, updateConsultationStatus);

// ✅ Update consultation details (Students only)
// This endpoint allows a student to update their consultation's topic and description.
router.put("/update/:id", authMiddleware, updateConsultation);

// ✅ Delete consultation (Students only)
// This endpoint allows a student to delete their own consultation.
router.delete("/delete/:id", authMiddleware, deleteConsultation);

// ✅ Create a teacher consultation (Students only)
router.post("/teacher-consultation", authMiddleware, createTeacherConsultation);

router.get("/teacher-consultations", authMiddleware, getTeacherConsultations);

router.put('/update-status-reply', authMiddleware, updateStatusReply);

router.get("/student-stats", getStudentStats);

// Apply middleware for role-based access
router.get("/consultations/all", authorizeRoles("Consultant"), getAllConsultations);
router.post("/consultations/create", authorizeRoles("Student"), createConsultation);

router.put("/update-status-reply", authMiddleware, updateStatusReply);

export default router;
