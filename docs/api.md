API Reference

Base URLs
- Node API: http://localhost:3001
- AI Service: http://localhost:5001

Auth
- POST /auth/register
  - body: { name: string, email: string, password: string }
  - 200: { message }
  - 400: { error }

- POST /auth/login
  - body: { email: string, password: string }
  - 200: { token: string, userId: string, name: string }
  - 400/500: { error }

Food Scan and History (Node)
- POST /api/food/scan
  - headers: Authorization: Bearer <JWT>
  - multipart/form-data; field: image (Node accepts "image", forwards as "file" to AI)
  - 200: { prediction: string, confidence: number, recommendation: string }

- GET /api/food/history
  - headers: Authorization: Bearer <JWT>
  - 200: Array<{ _id, userId, prediction, confidence, recommendation, createdAt }>

AI Service Endpoints (Flask)
- POST /predict
  - multipart/form-data; field: file
  - 200: { status: "Fresh"|"Spoiled", confidence: number, recommendation: string, color: string, timestamp: string }

- POST /analyze-diet
  - body: { food_items: string[] }
  - 200: object (see nutrition_analysis.py)

- POST /analyze-meal
  - body: { food_items: string[], portions?: number[] }
  - 200: object (see meal_planning.py)

- POST /health-recommendations
  - body: { conditions: string[] }
  - 200: object (see nutrition_analysis.py)
