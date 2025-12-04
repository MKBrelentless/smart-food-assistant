require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { MONGO_URI } = require("./config");

const app = express();

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// DATABASE CONNECTION
// -----------------------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -----------------------------
// ROUTES
// -----------------------------
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/scanRoutes"));
app.use("/api", require("./routes/historyRoutes"));

// -----------------------------
// ERROR HANDLER (better debugging)
// -----------------------------
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// -----------------------------
// DEFAULT ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("🥗 Smart Food Assistant API is running!");
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
