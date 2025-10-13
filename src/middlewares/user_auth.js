const jwt = require("jsonwebtoken");
const User = require("../models/user_schema");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {
  try {
    // ✅ Get token from standard Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        login: false,
        message: "You must be logged in. Please log in first.",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({
        login: false,
        message: "User not found. Please log in again.",
      });
    }

    // ✅ Attach user to request object for use in controllers
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      login: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = authenticateUser;
