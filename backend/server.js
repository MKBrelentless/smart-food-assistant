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

// Enhanced CORS configuration for Railway deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Railway domains
    if (origin.includes('railway.app') || origin.includes('up.railway.app')) {
      return callback(null, true);
    }
    
    // Allow Vercel, Netlify, and other common deployment platforms
    if (origin.includes('vercel.app') || origin.includes('netlify.app')) {
      return callback(null, true);
    }
    
    console.log('🔍 CORS Origin:', origin);
    callback(null, true); // Allow all origins for now
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// DATABASE CONNECTION
// -----------------------------
console.log("🔍 Attempting to connect to MongoDB...");
console.log("📍 MONGO_URI:", MONGO_URI ? "[SET]" : "[NOT SET]");
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "[SET]" : "[NOT SET]");

mongoose
  .connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    socketTimeoutMS: 45000, // 45 second socket timeout
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("🔍 Full error:", err);
    process.exit(1); // Exit if can't connect to database
  });

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

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
// HEALTH CHECK & DEBUG ROUTES
// -----------------------------
app.get("/", (req, res) => {
  res.json({
    message: "🥗 Smart Food Assistant API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI_SET: !!process.env.MONGO_URI,
      JWT_SECRET_SET: !!process.env.JWT_SECRET
    }
  });
});

app.get("/debug", (req, res) => {
  res.json({
    headers: req.headers,
    origin: req.get('origin'),
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString()
  });
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
