AI Service (Flask + TensorFlow)

Overview
- Flask service exposing model inference and nutrition analysis endpoints.
- Loads model from food_model.keras at startup.
- CORS allows http://localhost:3000.
- Default port: 5001.

Run
- cd ai-service
- python -m venv .venv && .venv/Scripts/activate (Windows)
- pip install flask flask-cors tensorflow pillow numpy
- Ensure food_model.keras exists; train if needed (see train_model.py/improved_train_model.py)
- python app.py

Endpoints
- POST /predict
  - multipart/form-data
  - field: file (the image)
  - Returns:
    {
      status: "Fresh" | "Spoiled",
      confidence: number(%) ,
      recommendation: string,
      color: "green"|"red",
      timestamp: string
    }

- POST /analyze-diet
  - body: { food_items: string[] }
  - Returns nutrition/diet balance analysis from nutrition_analysis.py

- POST /analyze-meal
  - body: { food_items: string[], portions?: number[] }
  - Returns meal nutrition from meal_planning.py

- POST /health-recommendations
  - body: { conditions: string[] }
  - Returns recommendation set from nutrition_analysis.py

Notes
- Model labels (class_labels) map to fresh/spoiled categories; analyze_prediction converts to Fresh/Spoiled and a recommendation.
- Images are saved to ai-service/uploads before preprocessing.
- Update CORS origins if running frontend on another host/port.
