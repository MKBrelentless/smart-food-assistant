Smart Food Assistant

Overview
- A full-stack application to assess food freshness using a TensorFlow/Keras model and provide nutrition/diet analysis.
- Architecture:
  - ai-service (Flask, TensorFlow) on port 5001 for predictions and nutrition endpoints
  - backend (Node/Express, MongoDB) on port 3001 for auth and history
  - frontend (React) on port 3000 for the UI

Quick Start
1) Prerequisites
- Node.js 18+
- Python 3.10+ with pip
- MongoDB running locally at mongodb://127.0.0.1:27017
- Git (optional)

2) Install and run AI service (port 5001)
- cd ai-service
- Create/activate a Python venv (recommended)
- pip install -r requirements.txt (if file not present, install: flask flask-cors tensorflow pillow numpy)
- Ensure food_model.keras exists in ai-service/ (train first if absent)
- python app.py

3) Install and run backend API (port 3001)
- cd backend
- npm install
- npm run dev (or npm start)

4) Install and run frontend (port 3000)
- cd frontend
- npm install
- npm start

Services and Ports
- Frontend: http://localhost:3000
- Node API: http://localhost:3001
- AI Service: http://localhost:5001

Environment Variables
- backend/config.js currently hardcodes:
  - MONGO_URI: mongodb://127.0.0.1:27017/smartfood
  - JWT_SECRET: supersecretkey123
- Recommended: switch to environment variables via a .env file and process.env usage.

Project Structure
- ai-service: Flask app.py with /predict, /analyze-diet, /analyze-meal, /health-recommendations
- backend: Express server.js with /auth, /api/food, /api routes; MongoDB models
- frontend: React app, src/api.js uses http://localhost:3001 for auth/history and http://localhost:5001 for AI

Primary Flows
- Authentication
  - POST /auth/register {name,email,password}
  - POST /auth/login {email,password} => { token, userId, name }
- Scan and History
  - Frontend sends image to AI service /predict (multipart form-data, field: file)
  - Backend exposes /api/food/scan (expects Authorization: Bearer <token> and multipart image under field name image); it forwards to AI and stores Scan in MongoDB
  - History available at GET /api/history (Authorization required)

Documentation Index
- docs/backend.md — backend setup, endpoints, and models
- docs/ai-service.md — prediction and nutrition endpoints, model notes
- docs/frontend.md — local development and API integration
- docs/api.md — REST API reference (auth, scan/history, AI)
- docs/env.md — environment configuration and .env migration guidance
- docs/contributing.md — conventions and contribution flow

Testing and Troubleshooting
- Ensure MongoDB is running locally
- Ensure AI service is running and reachable (http://localhost:5001/predict)
- If CORS issues occur, verify CORS config in ai-service/app.py and backend/server.js
- For large model loads, allow extra startup time for TensorFlow

Security Notes
- Do not commit real secrets. Replace backend/config.js with environment variables before production.
- Validate uploads and enforce size limits (multer memory storage is currently used).

License
- MIT (change as needed)
