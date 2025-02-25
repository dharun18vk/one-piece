import Consultation from "../models/Consultation.js";
import User from "../models/User.js";

// ✅ Create Consultation
export const createConsultation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only students can request consultations." });
    }

    const { topic, description, recipientType } = req.body;
    if (!topic || !description) {
      return res.status(400).json({ message: "Topic and description are required." });
    }

    // ✅ Set default recipientType if missing
    const finalRecipientType = recipientType || "Consultant"; 

    const newConsultation = new Consultation({
      student: req.user._id,
      topic,
      description,
      recipientType: finalRecipientType, // ✅ Use default if not provided
      status: "Pending",
    });

    await newConsultation.save();
    res.status(201).json({ message: "Consultation created successfully!", consultation: newConsultation });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// ✅ Get Student's Consultations
export const getStudentConsultations = async (req, res) => {
  try {
    if (req.user.role !== "Student")
      return res.status(403).json({ message: "Access denied" });

    const consultations = await Consultation.find({ student: req.user._id })
      .populate("consultant", "name email")
      .exec();
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get All Consultations (For Consultants)
export const getAllConsultations = async (req, res) => {
  try {
    if (req.user.role !== "Consultant")
      return res.status(403).json({ message: "Access denied" });

    const consultations = await Consultation.find()
      .populate("student", "name email")
      .populate("consultant", "name")
      .exec();
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Consultation Status (For Consultants)
export const updateConsultationStatus = async (req, res) => {
  try {
    if (req.user.role !== "Consultant")
      return res.status(403).json({ message: "Access denied" });

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

    res.json({
      message: "Consultation status updated!",
      consultation: updatedConsultation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Consultation Details (For Students)
// Allow a student to update the topic and description of their consultation.
// (Optionally, you might want to restrict editing to consultations that are still pending.)
export const updateConsultation = async (req, res) => {
  try {
    if (req.user.role !== "Student")
      return res.status(403).json({ message: "Access denied" });

    const { topic, description } = req.body;
    if (!topic || !description) {
      return res
        .status(400)
        .json({ message: "Topic and description are required." });
    }

    // Get consultation ID from route parameters
    const { id } = req.params;

    // Find the consultation and check if it belongs to the current student
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    if (consultation.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Optionally, restrict editing to pending consultations only
    if (consultation.status !== "Pending") {
      return res
        .status(400)
        .json({
          message: "Cannot edit consultation once it has been approved or rejected.",
        });
    }

    // Update fields
    consultation.topic = topic;
    consultation.description = description;

    const updatedConsultation = await consultation.save();
    res.status(200).json({
      message: "Consultation updated successfully",
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete Consultation (For Students)
// Allow a student to delete their own consultation.
export const deleteConsultation = async (req, res) => {
  try {
    if (req.user.role !== "Student")
      return res.status(403).json({ message: "Access denied" });

    // Get consultation ID from route parameters
    const { id } = req.params;

    // Find the consultation and check if it belongs to the current student
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    if (consultation.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete the consultation
    await Consultation.findByIdAndDelete(id);
    res.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const createTeacherConsultation = async (req, res) => {
  try {
    const { topic, description } = req.body;
    const studentId = req.user._id;

    if (!topic || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Get all teachers from the database
    const teachers = await User.find({ role: "Teacher" });

    if (!teachers.length) {
      return res.status(400).json({ message: "No teachers available." });
    }

    // ✅ Create a consultation for each teacher
    const consultations = teachers.map((teacher) => ({
      student: studentId,
      consultant: teacher._id, // ✅ Assign each teacher
      topic,
      description,
      recipientType: "Teacher",
      status: "Pending",
    }));

    // ✅ Bulk insert all consultations
    await Consultation.insertMany(consultations);

    res.status(201).json({ message: "Consultation request sent to all teachers!", consultations });
  } catch (error) {
    console.error("Error creating teacher consultation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const updateStatusReply = async (req, res) => {
  try {
    const { consultationId, status, reply } = req.body;

    // Fetch the consultation first
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Ensure only assigned consultants/teachers can update
    if (consultation.consultant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this consultation" });
    }

    // Update the consultation
    consultation.status = status;
    consultation.reply = reply;
    await consultation.save();

    res.json({ message: "Consultation updated successfully", consultation });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTeacherConsultations = async (req, res) => {
  try {
    console.log("Logged-in Teacher:", req.user); // ✅ Print logged-in teacher details

    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Access denied. Only teachers can view consultations." });
    }

    console.log("Fetching consultations for teacher ID:", req.user._id);

    const consultations = await Consultation.find({
      consultant: req.user._id, 
      recipientType: "Teacher",
    }).populate("student", "name email");
    
    

    console.log("Consultations Found:", consultations); // ✅ Log fetched data

    res.json(consultations);
  } catch (error) {
    console.error("Error fetching teacher consultations:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id)
      .populate("student", "name email")
      .populate("consultant", "name email")
      .exec();

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json(consultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};







