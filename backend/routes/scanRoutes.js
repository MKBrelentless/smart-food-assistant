const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");
const { JWT_SECRET } = require("../config");
const Scan = require("../models/Scan");

const router = express.Router();

// -----------------------------
// AUTH MIDDLEWARE
// -----------------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// -----------------------------
// MULTER SETUP (IN-MEMORY STORAGE)
// -----------------------------
const upload = multer({ storage: multer.memoryStorage() });

// -----------------------------
// PYTHON AI SERVICE URL (port 5001)
// -----------------------------
const aiServiceURL = "http://127.0.0.1:5001/predict";

// -----------------------------
// POST /food/scan → SEND IMAGE TO PYTHON AI SERVICE
// -----------------------------
router.post("/scan", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    console.log("📤 Sending image to Python AI service...");

    // Create form-data to send the image
    const formData = new FormData();
    const buffer = Buffer.from(req.file.buffer);
    formData.append("file", buffer, {
      filename: req.file.originalname || "image.jpg",
      contentType: req.file.mimetype,
      knownLength: buffer.length
    });

    // Send image to Flask API
    const response = await axios.post(aiServiceURL, formData, {
      headers: formData.getHeaders(),
    });

    const { status: prediction, confidence, advice } = response.data;

    console.log(`✅ Received prediction: ${prediction} (${confidence}%)`);

    // Generate smart recommendation based on prediction
    let recommendation = advice;

    if (prediction.includes("spoiled")) {
      recommendation = "This food appears spoiled. Avoid consuming it.";
    } else if (prediction.includes("fresh")) {
      recommendation = "This food looks fresh and safe to eat.";
    } else if (prediction.includes("fruits")) {
      recommendation = "This looks like fruit. Check for softness or dark spots before eating.";
    } else if (prediction.includes("vegetables")) {
      recommendation = "This looks like a vegetable. Ensure it’s firm and properly washed before use.";
    } else if (prediction.includes("dairy")) {
      recommendation = "This is a dairy product. Keep refrigerated and check for sour smell before use.";
    } else if (prediction.includes("meat")) {
      recommendation = "This appears to be meat. Ensure proper storage and cook thoroughly before eating.";
    } else if (prediction.includes("seafood")) {
      recommendation = "This looks like seafood. Store on ice and cook well to avoid contamination.";
    } else if (prediction.includes("spices")) {
      recommendation = "These are spices. Store in a cool, dry place to maintain freshness.";
    } else if (prediction.includes("grains")) {
      recommendation = "This looks like a grain-based food. Keep it dry and sealed to prevent spoilage.";
    } else {
      recommendation = "Unable to determine freshness. Please inspect manually.";
    }

    // Save scan result in MongoDB
    const scan = new Scan({
      userId: req.userId,
      prediction,
      confidence,
      recommendation,
      createdAt: new Date(),
    });

    await scan.save();

    // Respond with prediction
    res.json({
      prediction,
      confidence,
      recommendation,
    });

  } catch (err) {
    console.error("❌ Scan error:", err.message);
    res.status(500).json({
      error: "Failed to analyze image. Please try again.",
      details: err.message,
    });
  }
});

// -----------------------------
// GET /food/history → Retrieve user scan history
// -----------------------------
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Scan.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

module.exports = router;
