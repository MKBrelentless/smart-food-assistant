import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
import json
from datetime import datetime

def load_model():
    """Load the trained model"""
    MODEL_PATH = "food_model.keras"
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("❌ Model file not found! Train and save food_model.keras first.")
    
    print("✅ Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
    return model

def preprocess_image(img_path):
    """Preprocess image for model prediction"""
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"❌ Error preprocessing image: {str(e)}")
        return None

def predict_image(model, img_path):
    """Make prediction on a single image"""
    try:
        # Preprocess image
        img_array = preprocess_image(img_path)
        if img_array is None:
            return None
        
        # Make prediction
        print(f"Making prediction for {os.path.basename(img_path)}...")
        preds = model.predict(img_array, verbose=0)
        
        # Get class probabilities
        class_labels = ["fresh", "spoiled"]
        class_probs = {
            class_labels[i]: float(prob)
            for i, prob in enumerate(preds[0])
        }
        
        # Apply threshold for spoiled detection
        SPOILED_THRESHOLD = 0.45  # Increased threshold to reduce false positives
        if class_probs["spoiled"] > SPOILED_THRESHOLD:
            prediction = "spoiled"
            confidence = class_probs["spoiled"]
        else:
            prediction = "fresh"
            confidence = class_probs["fresh"]
            
        result = {
            "image": os.path.basename(img_path),
            "prediction": prediction,
            "confidence": round(confidence * 100, 2),
            "probabilities": {
                k: round(v * 100, 2) 
                for k, v in class_probs.items()
            }
        }
        print(f"✅ Prediction complete: {prediction.upper()} ({result['confidence']}%)")
        return result
    except Exception as e:
        print(f"❌ Error making prediction: {str(e)}")
        return None

def main():
    # Test cases with different categories
    test_images = [
        # Fresh bread samples
        "datasets/mydataset/train/fresh_bread/bread_fresh_1.jpg",
        "datasets/mydataset/train/fresh_bread/bread_fresh_50.jpg",
        "datasets/mydataset/train/fresh_bread/bread_fresh_100.jpg",
        
        # Fresh fruits samples
        "datasets/mydataset/train/fresh_fruits/fruits_fresh_1.jpg",
        "datasets/mydataset/train/fresh_fruits/fruits_fresh_50.jpg",
        "datasets/mydataset/train/fresh_fruits/fruits_fresh_100.jpg",
        
        # Fresh vegetables samples
        "datasets/mydataset/train/fresh_vegetables/vegetables_fresh_1.jpg",
        "datasets/mydataset/train/fresh_vegetables/vegetables_fresh_50.jpg",
        "datasets/mydataset/train/fresh_vegetables/vegetables_fresh_100.jpg",
        
        # Fresh dairy samples (if available)
        "datasets/mydataset/train/fresh_dairy/dairy_fresh_1.jpg",
        "datasets/mydataset/train/fresh_dairy/dairy_fresh_50.jpg",
        
        # Spoiled samples
        "datasets/mydataset/train/spoiled/spoiled_food_1.jpg",
        "datasets/mydataset/train/spoiled/spoiled_food_25.jpg",
        "datasets/mydataset/train/spoiled/spoiled_food_50.jpg",
        "datasets/mydataset/train/spoiled/spoiled_food_75.jpg"
    ]
    
    try:
        # Load model
        print("\nInitializing model test...")
        print("=" * 50)
        model = load_model()
        
        # Process each test image
        results = []
        print("\nTesting images...")
        print("=" * 50)
        
        for img_path in test_images:
            if os.path.exists(img_path):
                print(f"\nProcessing: {os.path.basename(img_path)}")
                result = predict_image(model, img_path)
                if result:
                    results.append(result)
                    print("Class probabilities:")
                    for class_name, prob in result['probabilities'].items():
                        print(f"  - {class_name}: {prob}%")
            else:
                print(f"❌ Image not found: {img_path}")
        
        # Analyze results by category
        categories = {
            'bread': {'fresh': [], 'spoiled': []},
            'fruits': {'fresh': [], 'spoiled': []},
            'vegetables': {'fresh': [], 'spoiled': []},
            'dairy': {'fresh': [], 'spoiled': []}
        }
        
        for result in results:
            img_name = result['image']
            for category in categories.keys():
                if category in img_name:
                    is_spoiled = 'spoiled' in img_name
                    categories[category]['spoiled' if is_spoiled else 'fresh'].append(result)
        
        # Print summary statistics
        print("\nTest Summary by Category:")
        print("=" * 50)
        for category, data in categories.items():
            print(f"\n{category.upper()}:")
            for condition in ['fresh', 'spoiled']:
                items = data[condition]
                if items:
                    confidences = [item['confidence'] for item in items]
                    avg_confidence = sum(confidences) / len(confidences)
                    correct_predictions = sum(1 for item in items 
                                           if item['prediction'] == condition)
                    accuracy = (correct_predictions / len(items)) * 100
                    
                    print(f"  {condition.upper()}:")
                    print(f"    - Samples tested: {len(items)}")
                    print(f"    - Average confidence: {avg_confidence:.2f}%")
                    print(f"    - Accuracy: {accuracy:.2f}%")
        
        # Save detailed results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"model_test_results_{timestamp}.json"
        with open(output_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "num_images_tested": len(results),
                "summary_by_category": {
                    category: {
                        condition: {
                            "num_samples": len(data[condition]),
                            "avg_confidence": sum(item['confidence'] for item in data[condition]) / len(data[condition]) if data[condition] else 0,
                            "accuracy": (sum(1 for item in data[condition] if item['prediction'] == condition) / len(data[condition]) * 100) if data[condition] else 0
                        }
                        for condition in ['fresh', 'spoiled']
                    }
                    for category, data in categories.items()
                },
                "results": results
            }, f, indent=2)
        print(f"\n✅ Detailed results saved to {output_file}")
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")

if __name__ == "__main__":
    main()