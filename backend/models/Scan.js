const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodImage: String,
  prediction: String,
  confidence: Number,
  recommendation: String,
  scanDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Scan", scanSchema);
