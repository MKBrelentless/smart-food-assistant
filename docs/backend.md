Backend (Node/Express)

Overview
- Express API for authentication, scan proxying/storage, and history retrieval.
- Depends on MongoDB and JWT auth.

Run
- cd backend
- npm install
- npm run dev (nodemon) or npm start
- Default port: 3001

Config
- File: backend/config.js
  - MONGO_URI: mongodb://127.0.0.1:27017/smartfood
  - JWT_SECRET: supersecretkey123
- Recommendation: migrate to environment variables and a .env file:
  - MONGO_URI=mongodb://127.0.0.1:27017/smartfood
  - JWT_SECRET=change-me
  - In config.js, export from process.env with sensible defaults.

Routes
- Base: http://localhost:3001

Auth
- POST /auth/register
  - body: { name, email, password }
  - 400 if email exists
- POST /auth/login
  - body: { email, password }
  - returns { token, userId, name }

Food Scan and History
- Middleware: Bearer token required (Authorization header).
- POST /api/food/scan
  - multipart/form-data; field name: image
  - forwards image to AI service POST http://127.0.0.1:5001/predict (field name file)
  - stores result in MongoDB collection scans
  - response: { prediction, confidence, recommendation }
- GET /api/food/history
  - returns list of scans for current user (sorted by createdAt desc)

History Routes Namespace Note
- server.js also mounts app.use("/api", require("./routes/historyRoutes")); ensure historyRoutes.js exists and does not conflict with /api/food/history in scanRoutes.js. In the current code, history is already served by scanRoutes.js at /api/food/history.

Models
- models/User.js: User schema (name, email, password hash)
- models/Scan.js: Scan schema (userId, prediction, confidence, recommendation, createdAt)

Error Handling
- Global error handler returns 500 JSON.

CORS and Static
- CORS enabled globally.
- /uploads served statically from backend/uploads.

Development Tips
- Use Postman or curl with Authorization header to test endpoints.
- Seed a test user, then call /api/food/scan with an image.
