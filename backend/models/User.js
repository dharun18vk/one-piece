import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["Student", "Consultant"], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// ✅ Prevent model overwriting in development
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
