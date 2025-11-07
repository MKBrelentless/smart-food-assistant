import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

# --------------------------
# Paths
# --------------------------
model_path = "food_model.keras"
image_path = r"C:\Users\Austine Mukabwa\Downloads\tomatos.jpg"  # 👈 update your image path

# --------------------------
# Load model
# --------------------------
print("✅ Loading model...")
model = tf.keras.models.load_model(model_path)

# --------------------------
# Class labels (MUST match dataset folder names)
# --------------------------
class_labels = [
    "fresh_bread",
    "fresh_dairy",
    "fresh_fruits",
    "spoiled_bread",
    "spoiled_dairy",
    "spoiled_fruits",
    "spoiled_vegetables"
]

# --------------------------
# Load and preprocess image
# --------------------------
img = image.load_img(image_path, target_size=(224, 224))
img_array = image.img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# --------------------------
# Predict
# --------------------------
preds = model.predict(img_array)
confidence = tf.nn.softmax(preds[0]).numpy()
pred_idx = np.argmax(confidence)

print(f"\n🍽 Prediction: {class_labels[pred_idx]}")
print(f"Confidence: {confidence[pred_idx]*100:.2f}%")

# Show top-3 predictions
top_indices = confidence.argsort()[-3:][::-1]
print("\nTop-3 Predictions:")
for i, idx in enumerate(top_indices):
    print(f"{i+1}. {class_labels[idx]} — {confidence[idx]*100:.2f}%")
