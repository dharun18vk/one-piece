import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    console.log("🔹 Checking Authorization Header:", req.header("Authorization"));

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.error("❌ No token provided.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔹 Extracted Token:", token);

    if (!token) {
      console.error("❌ Token missing after split.");
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error("❌ User not found in database.");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default authMiddleware;

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
      }
      next();
  };
};