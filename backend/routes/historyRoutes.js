const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const Scan = require("../models/Scan");

const router = express.Router();

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

router.get("/history", authMiddleware, async (req, res) => {
  const history = await Scan.find({ userId: req.userId }).sort({ scanDate: -1 });
  res.json(history);
});

module.exports = router;
