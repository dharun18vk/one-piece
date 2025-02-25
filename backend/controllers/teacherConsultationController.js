import Consultation from "../models/Consultation.js";
import User from "../models/User.js";

export const createTeacherConsultation = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { topic, description } = req.body;
    if (!topic || !description) {
      return res.status(400).json({ message: "Topic and description are required." });
    }

    // ✅ Auto-assign a teacher (if available)
    const teacher = await User.findOne({ role: "Teacher" });

    const newConsultation = new Consultation({
      student: req.user._id,
      teacher: teacher ? teacher._id : null,
      topic,
      description,
    });

    await newConsultation.save();
    res.status(201).json({ message: "Teacher consultation request created!", consultation: newConsultation });
  } catch (error) {
    console.error("Error creating teacher consultation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
