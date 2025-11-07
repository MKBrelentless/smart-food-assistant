import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from datetime import datetime
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"]
    }
})  # ✅ Allow React frontend with full CORS configuration

# --------------------------
# Load Model
# --------------------------
MODEL_PATH = "food_model.keras"
model = None

def load_model():
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            logger.error(f"❌ Model file not found at {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        logger.info("✅ Loading model...")
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        logger.info(f"✅ Model loaded successfully from {MODEL_PATH}")
        return True
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        logger.error(traceback.format_exc())
        return False

# Try to load the model
if not load_model():
    logger.error("❌ Failed to load model on startup")

# --------------------------
# Class Labels
# --------------------------
class_labels = ["fresh", "spoiled"]  # Matches the dataset structure

# --------------------------
# Helper Function
# --------------------------
def get_food_status(pred_class):
    """Return freshness status and advice."""
    if "spoiled" in pred_class.lower():
        return {
            "status": "Spoiled",
            "advice": "⚠️ This food appears spoiled. Please dispose of it safely.",
            "color": "red"
        }
    else:
        return {
            "status": "Fresh",
            "advice": "✅ This food looks fresh and safe to consume.",
            "color": "green"
        }

# --------------------------
# Prediction Route
# --------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        logger.info("📝 Received prediction request")
        logger.debug(f"Request Files: {request.files}")
        logger.debug(f"Request Headers: {request.headers}")
        
        # Check if model is loaded
        if model is None:
            logger.info("⏳ Model not loaded, attempting to load...")
            if not load_model():
                logger.error("❌ Failed to load model")
                return jsonify({"error": "Model not available"}), 503
            logger.info("✅ Model loaded successfully")
        
        if 'file' not in request.files:
            logger.error("❌ No file found in request")
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        if file.filename == '':
            logger.error("❌ Empty filename")
            return jsonify({"error": "No selected file"}), 400
            
        # Check file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            logger.error("❌ Invalid file type")
            return jsonify({"error": "Invalid file type. Please upload a PNG or JPEG image"}), 400
            
        # Save image temporarily
        os.makedirs("uploads", exist_ok=True)
        img_path = os.path.join("uploads", f"temp_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
        logger.info(f"💾 Saving file to {img_path}")
        file.save(img_path)
        
        if not os.path.exists(img_path):
            logger.error(f"❌ Failed to save file at {img_path}")
            return jsonify({"error": "Failed to save uploaded file"}), 500
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        import traceback
        print("Stack trace:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

    try:
        # Preprocess image
        logger.info("🖼️ Loading and preprocessing image...")
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        
        # Normalize image
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        logger.info("✅ Image preprocessing completed")
    except Exception as e:
        logger.error(f"❌ Error preprocessing image: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to process image"}), 500

    # Make prediction
    preds = model.predict(img_array)
    print("Raw predictions:", preds)  # Debug print
    
    # Get prediction probabilities for each class
    class_probabilities = {
        class_labels[i]: float(prob) 
        for i, prob in enumerate(preds[0])
    }
    print("Class probabilities:", class_probabilities)
    
    # Get prediction with threshold
    spoiled_prob = class_probabilities["spoiled"]
    fresh_prob = class_probabilities["fresh"]
    
    # Use threshold to help prevent false "fresh" predictions
    SPOILED_THRESHOLD = 0.4  # If spoiled probability > 40%, classify as spoiled
    
    if spoiled_prob > SPOILED_THRESHOLD:
        class_index = 1  # spoiled
        confidence = spoiled_prob
    else:
        class_index = 0  # fresh
        confidence = fresh_prob

    pred_class = class_labels[class_index]
    confidence_percent = round(confidence * 100, 2)

    result_info = get_food_status(pred_class)

    result = {
        "status": result_info["status"],        # ✅ Only "Fresh" or "Spoiled"
        "confidence": confidence_percent,       # Number, not string
        "advice": result_info["advice"],
        "color": result_info["color"],
        "timestamp": datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
    }

    print(f"✅ Predicted: {result['status']} ({confidence_percent}%) — {result_info['advice']}")
    return jsonify(result)

# --------------------------
# Status endpoint
# --------------------------
@app.route("/status", methods=["GET"])
def status():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    })

# Import nutrition analysis and meal planning
from nutrition_analysis import analyze_diet_balance, get_health_recommendations
from meal_planning import calculate_meal_nutrition, generate_meal_plan
from nutrition_database import EXPANDED_FOOD_DATABASE, EXPANDED_HEALTH_CONDITIONS, RECIPES_DATABASE
from meal_scheduler import (
    generate_weekly_meal_plan,
    generate_shopping_list,
    track_nutrition_progress
)

# Diet Analysis endpoint
@app.route("/analyze-diet", methods=["POST"])
def analyze_diet():
    try:
        logger.info("📝 Received diet analysis request")
        data = request.get_json()
        if not data:
            logger.error("❌ No JSON data received")
            return jsonify({"error": "No data provided"}), 400
            
        if 'food_items' not in data:
            logger.error("❌ No food items in request")
            return jsonify({"error": "No food items provided"}), 400
            
        food_items = data['food_items']
        if not isinstance(food_items, list):
            logger.error("❌ Food items must be a list")
            return jsonify({"error": "Food items must be a list"}), 400
            
        if not food_items:
            logger.error("❌ Empty food items list")
            return jsonify({"error": "Food items list is empty"}), 400
            
        logger.info(f"🔍 Analyzing diet for {len(food_items)} food items")
        
        try:
            # Get detailed diet analysis
            analysis = analyze_diet_balance(food_items)
            
            # Add recommendations based on missing categories
            missing_categories = [
                category for category, count in analysis['composition'].items()
                if count == 0
            ]
            
            recommendations = []
            for category in missing_categories:
                if category in EXPANDED_FOOD_DATABASE:
                    suggestions = []
                    for subcategory in EXPANDED_FOOD_DATABASE[category].values():
                        suggestions.extend(subcategory[:2])  # Get first 2 items from each subcategory
                    recommendations.append({
                        'category': category,
                        'suggestions': suggestions[:5]  # Limit to 5 suggestions per category
                    })
            
            # Calculate balance score
            total_categories = len(EXPANDED_FOOD_DATABASE)
            covered_categories = sum(1 for count in analysis['composition'].values() if count > 0)
            balance_score = (covered_categories / total_categories) * 100
            
            # Add health insights
            health_conditions = data.get('health_conditions', [])
            if health_conditions:
                health_recommendations = get_health_recommendations(health_conditions)
                analysis['health_recommendations'] = health_recommendations
            
            response = {
                'balance_score': round(balance_score, 2),
                'composition': analysis['composition'],
                'categorization': analysis['categorization'],
                'missing_nutrients': missing_categories,
                'recommendations': recommendations,
                'nutrition_summary': analysis.get('nutrition_summary', {}),
            }
            
            logger.info("✅ Diet analysis completed successfully")
            return jsonify(response)
            
        except Exception as inner_e:
            logger.error(f"❌ Error in diet analysis processing: {str(inner_e)}")
            logger.error(f"Stack trace: {traceback.format_exc()}")
            return jsonify({
                "error": "Diet analysis processing failed",
                "details": str(inner_e)
            }), 500
            
    except Exception as e:
        logger.error(f"❌ Error analyzing diet: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        return jsonify({
            "error": "Diet analysis request failed",
            "details": str(e)
        }), 500

# Health Recommendations endpoint
@app.route("/health-recommendations", methods=["POST"])
def health_advice():
    try:
        data = request.get_json()
        if not data or 'conditions' not in data:
            return jsonify({"error": "No health conditions provided"}), 400
            
        conditions = data['conditions']
        recommendations = get_health_recommendations(conditions)
        return jsonify(recommendations)
    except Exception as e:
        logger.error(f"❌ Error getting health recommendations: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Meal Nutrition Analysis endpoint
@app.route("/analyze-meal", methods=["POST"])
def analyze_meal():
    try:
        data = request.get_json()
        if not data or 'food_items' not in data:
            return jsonify({"error": "No food items provided"}), 400
            
        food_items = data['food_items']
        portions = data.get('portions', None)
        
        analysis = calculate_meal_nutrition(food_items, portions)
        return jsonify(analysis)
    except Exception as e:
        logger.error(f"❌ Error analyzing meal: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Meal Plan Generation endpoint
@app.route("/generate-meal-plan", methods=["POST"])
def meal_plan():
    try:
        data = request.get_json()
        conditions = data.get('conditions', [])
        target_calories = data.get('target_calories', 2000)
        
        meal_plan = generate_meal_plan(conditions, target_calories)
        return jsonify(meal_plan)
    except Exception as e:
        logger.error(f"❌ Error generating meal plan: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Get Food Database endpoint
@app.route("/food-database", methods=["GET"])
def get_food_database():
    try:
        return jsonify(EXPANDED_FOOD_DATABASE)
    except Exception as e:
        logger.error(f"❌ Error retrieving food database: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Weekly Meal Plan endpoint
@app.route("/weekly-meal-plan", methods=["POST"])
def get_weekly_meal_plan():
    try:
        data = request.get_json()
        conditions = data.get('conditions', [])
        target_calories = data.get('target_calories', 2000)
        
        plan = generate_weekly_meal_plan(conditions, target_calories)
        return jsonify(plan)
    except Exception as e:
        logger.error(f"❌ Error generating weekly meal plan: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Shopping List endpoint
@app.route("/shopping-list", methods=["POST"])
def get_shopping_list():
    try:
        data = request.get_json()
        meal_plan = data.get('meal_plan')
        if not meal_plan:
            return jsonify({"error": "No meal plan provided"}), 400
            
        shopping_list = generate_shopping_list(meal_plan)
        return jsonify(shopping_list)
    except Exception as e:
        logger.error(f"❌ Error generating shopping list: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Progress Tracking endpoint
@app.route("/track-progress", methods=["POST"])
def get_nutrition_progress():
    try:
        data = request.get_json()
        meal_logs = data.get('meal_logs')
        target_calories = data.get('target_calories', 2000)
        
        if not meal_logs:
            return jsonify({"error": "No meal logs provided"}), 400
            
        progress = track_nutrition_progress(meal_logs, target_calories)
        return jsonify(progress)
    except Exception as e:
        logger.error(f"❌ Error tracking progress: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Get Recipes endpoint
@app.route("/recipes", methods=["GET"])
def get_recipes():
    try:
        conditions = request.args.getlist('conditions')
        if conditions:
            # Filter recipes by health conditions
            filtered_recipes = {
                recipe_id: recipe for recipe_id, recipe in RECIPES_DATABASE.items()
                if all(condition in recipe['suitable_for'] for condition in conditions)
            }
            return jsonify(filtered_recipes)
        return jsonify(RECIPES_DATABASE)
    except Exception as e:
        logger.error(f"❌ Error retrieving recipes: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Get Health Conditions Database endpoint
@app.route("/health-conditions", methods=["GET"])
def get_health_conditions():
    try:
        return jsonify(EXPANDED_HEALTH_CONDITIONS)
    except Exception as e:
        logger.error(f"❌ Error retrieving health conditions: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run App
# --------------------------
if __name__ == "__main__":
    logger.info("🚀 Starting AI service...")
    app.run(host="0.0.0.0", port=5001, debug=True)
