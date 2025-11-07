const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
