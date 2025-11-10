Environment and Configuration

Local Defaults
- MongoDB: mongodb://127.0.0.1:27017/smartfood
- Ports: frontend 3000, backend 3001, ai-service 5001

Backend Environment
- Current code uses backend/config.js constants.
- Recommended .env (backend/.env):
  MONGO_URI=mongodb://127.0.0.1:27017/smartfood
  JWT_SECRET=change-me
  PORT=3001
- Update backend/config.js to read from process.env with defaults.

AI Service Environment
- PORT is hardcoded to 5001 in app.py; you can make this configurable via os.environ.get("PORT", 5001).
- Ensure food_model.keras is present.

Frontend Environment
- Uses hardcoded base URLs in src/api.js.
- Recommended: use .env at frontend/.env:
  REACT_APP_NODE_BASE_URL=http://localhost:3001
  REACT_APP_AI_BASE_URL=http://localhost:5001
- Then read process.env.REACT_APP_* in src/api.js.

CORS
- AI service allows origin http://localhost:3000; update origins if deploying elsewhere.
