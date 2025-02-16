import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import consultationRoutes from "./routes/consultationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import Consultation from "./models/Consultation.js"; // ✅ Ensure correct model import
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// ✅ Ensure correct database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Register Authentication Routes
app.use("/auth", authRoutes);

// ✅ Register Consultation Routes
app.use("/consultations", consultationRoutes);

// ✅ Fix Registration Route (Ensuring Password Hashing)
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!["Student", "Consultant"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role. Must be 'Student' or 'Consultant'." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// ✅ Fix Login Route (JWT Authentication)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No records found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password!" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "Login successful!", token, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
});

// ✅ Create Consultation Route (Fix JWT Handling)
app.post("/consultations/create", async (req, res) => {
  try {
    const { topic, description } = req.body;
    if (!topic || !description) {
      return res.status(400).json({ error: "Topic and description are required." });
    }

    // ✅ Validate Token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "Student") {
      return res.status(403).json({ error: "Only students can request consultations." });
    }

    const newConsultation = new Consultation({
      student: user._id,
      topic,
      description,
      status: "Pending",
    });

    await newConsultation.save();
    res.status(201).json({ message: "Consultation request created successfully!" });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ error: "Internal Server Error. Please try again." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
