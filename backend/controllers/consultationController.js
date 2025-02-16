import Consultation from "../models/Consultation.js";
import User from "../models/User.js";

// ✅ Create Consultation
export const createConsultation = async (req, res) => {
  try {
    if (req.user.role !== "Student") return res.status(403).json({ message: "Access denied" });

    const { topic, description } = req.body;
    if (!topic || !description) {
      return res.status(400).json({ message: "Topic and description are required." });
    }

    // Auto-assign a consultant (if available)
    const consultant = await User.findOne({ role: "Consultant" });

    const newConsultation = new Consultation({
      student: req.user._id,
      consultant: consultant ? consultant._id : null,
      topic,
      description,
    });

    await newConsultation.save();
    res.status(201).json({ message: "Consultation request created!", consultation: newConsultation });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Student's Consultations
export const getStudentConsultations = async (req, res) => {
  try {
    if (req.user.role !== "Student") return res.status(403).json({ message: "Access denied" });

    const consultations = await Consultation.find({ student: req.user._id }).populate("consultant", "name email");
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get All Consultations (For Consultants)
export const getAllConsultations = async (req, res) => {
  try {
    if (req.user.role !== "Consultant") return res.status(403).json({ message: "Access denied" });

    const consultations = await Consultation.find().populate("student", "name email").populate("consultant", "name");
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Consultation Status (For Consultants)
export const updateConsultationStatus = async (req, res) => {
  try {
    if (req.user.role !== "Consultant") return res.status(403).json({ message: "Access denied" });

    const { consultationId, status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      consultationId,
      { status },
      { new: true }
    );

    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({ message: "Consultation status updated!", consultation: updatedConsultation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
