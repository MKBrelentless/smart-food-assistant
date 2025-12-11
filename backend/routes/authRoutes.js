const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log("📝 Registration attempt for:", email);
  
  // Validate input
  if (!name || !email || !password) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  
  if (password.length < 6) {
    console.log("❌ Password too short");
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  
  try {
    console.log("🔍 Checking if user exists...");
    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    console.log("🔒 Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    
    console.log("📄 Creating new user...");
    const user = new User({ name, email, password: hashed });
    await user.save();

    console.log("✅ User registered successfully:", email);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    console.error("🔍 Full error:", err);
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  console.log("🔑 Login attempt for:", email);
  
  // Validate input
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  try {
    console.log("🔍 Finding user in database...");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("🔒 Comparing passwords...");
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("🎫 Generating JWT token...");
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    console.log("✅ Login successful for:", email);
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    console.error("🔍 Full error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

module.exports = router;
