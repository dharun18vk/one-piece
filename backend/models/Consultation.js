import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reply: { type: String, default: "" },
  recipientType: { type: String, enum: ["Consultant", "Teacher"] }, // ✅ Add this field
});

const Consultation = mongoose.model("Consultation", ConsultationSchema);
export default Consultation;

