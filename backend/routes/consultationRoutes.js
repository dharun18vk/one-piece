import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createConsultation,
  getStudentConsultations,
  getAllConsultations,
  updateConsultationStatus
} from "../controllers/consultationController.js";

const router = express.Router();

// ✅ Create a consultation (Students only)
router.post("/create", authMiddleware, createConsultation);

// ✅ Get consultations for a student
router.get("/student", authMiddleware, getStudentConsultations);

// ✅ Get all consultations (For consultants only)
router.get("/all", authMiddleware, getAllConsultations);

// ✅ Update consultation status (Consultants only)
router.put("/update-status", authMiddleware, updateConsultationStatus);

export default router;
