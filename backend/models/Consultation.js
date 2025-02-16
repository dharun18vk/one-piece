import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  consultant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  topic: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ✅ Prevent model overwriting in development
const Consultation = mongoose.models.Consultation || mongoose.model("Consultation", ConsultationSchema);

export default Consultation;
