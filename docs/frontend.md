Frontend (React)

Overview
- React app providing login/register, dashboard, scan, diet analysis, and history views.
- Uses src/api.js to call Node backend (auth/history) and AI service (predict).

Run
- cd frontend
- npm install
- npm start
- Default dev server: http://localhost:3000

Key Integration Points (src/api.js)
- NODE_BASE_URL = http://localhost:3001
- AI_BASE_URL = http://localhost:5001
- register(credentials) -> POST /auth/register
- login(credentials) -> POST /auth/login
- scanFood(formData) -> POST AI /predict with multipart form-data (field "file")
- getHistory(token) -> GET /api/history with Authorization: Bearer <token>

Pages
- src/pages/Login.js, Register.js, Dashboard.js, Scan.js, History.js, DietAnalysis.js
- Components: components/ShoppingList.js, components/ProgressTracker.js

Env Overrides
- Consider using .env files with REACT_APP_NODE_BASE_URL and REACT_APP_AI_BASE_URL and reading them in src/api.js for easier environment switching.
