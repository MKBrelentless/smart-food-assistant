import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://smart-food-assistant-production.up.railway.app", "https://smart-food-assistant.up.railway.app"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"]
    }
})

# --------------------------
# Load Model
# --------------------------
MODEL_PATH = "food_model.keras"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("❌ Model file not found! Please train and save food_model.keras first.")
model = tf.keras.models.load_model(MODEL_PATH)

# --------------------------
# Class Labels
# --------------------------
class_labels = [
    "fresh_bread",
    "fresh_dairy",
    "fresh_fruits",
    "fresh_vegetables",
    "spoiled_bread",
    "spoiled_dairy",
    "spoiled_fruits",
    "spoiled_vegetables"
]

# --------------------------
# Generate Fresh/Spoiled + Recommendation
# --------------------------
def analyze_prediction(pred_class):
    if "spoiled" in pred_class:
        status = "Spoiled"
        recommendation = (
            "⚠️ The food appears spoiled. "
            "Please do not consume it. Dispose safely to prevent contamination."
        )
        color = "red"
    else:
        status = "Fresh"
        recommendation = (
            "✅ The food looks fresh! "
            "Store it properly — refrigerate if perishable to maintain freshness."
        )
        color = "green"
    
    return status, recommendation, color

# --------------------------
# Prediction Endpoint
# --------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No image file uploaded."}), 400

    img_file = request.files["file"]
    os.makedirs("uploads", exist_ok=True)
    img_path = os.path.join("uploads", img_file.filename)
    img_file.save(img_path)

    # Preprocess image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = np.expand_dims(image.img_to_array(img) / 255.0, axis=0)

    # Predict
    preds = model.predict(img_array)
    class_index = np.argmax(preds)
    confidence = float(np.max(preds))
    pred_class = class_labels[class_index]

    # Simplify result
    status, recommendation, color = analyze_prediction(pred_class)

    result = {
        "status": status,  # Fresh / Spoiled
        "confidence": round(confidence * 100, 2),
        "recommendation": recommendation,
        "color": color,
        "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
    }

    print(f"✅ Prediction: {status} ({pred_class}) — {result['confidence']}%")

    return jsonify(result)

# --------------------------
# Diet Analysis endpoint
@app.route("/analyze-diet", methods=["POST"])
def analyze_diet():
    try:
        data = request.get_json()
        if not data or 'food_items' not in data:
            return jsonify({"error": "No food items provided"}), 400
        
        from nutrition_analysis import analyze_diet_balance
        food_items = data['food_items']
        analysis = analyze_diet_balance(food_items)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Meal Analysis endpoint
@app.route("/analyze-meal", methods=["POST"])
def analyze_meal():
    try:
        data = request.get_json()
        if not data or 'food_items' not in data:
            return jsonify({"error": "No food items provided"}), 400
        
        from meal_planning import calculate_meal_nutrition
        food_items = data['food_items']
        portions = data.get('portions', None)
        analysis = calculate_meal_nutrition(food_items, portions)
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health Recommendations endpoint
@app.route("/health-recommendations", methods=["POST"])
def health_advice():
    try:
        data = request.get_json()
        if not data or 'conditions' not in data:
            return jsonify({"error": "No health conditions provided"}), 400
        
        from nutrition_analysis import get_health_recommendations
        conditions = data['conditions']
        recommendations = get_health_recommendations(conditions)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run App
# --------------------------
if __name__ == "__main__":
    print("🚀 Starting AI service on port 5001...")
    app.run(port=5001, debug=True)
