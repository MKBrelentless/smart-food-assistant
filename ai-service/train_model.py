import os
import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.applications import EfficientNetV2S
import pandas as pd
import seaborn as sns
from sklearn.metrics import confusion_matrix

# --------------------------
# Paths
# --------------------------
train_dir = "datasets/mydataset/train"
val_dir = "datasets/mydataset/val"
model_path = "food_model.keras"
class_indices_path = "class_indices.json"

# --------------------------
# Parameters
# --------------------------
img_size = (224, 224)
batch_size = 32
epochs = 50  # Increased epochs for better learning
initial_learning_rate = 1e-4

# --------------------------
# Data Generators with Advanced Augmentation
# --------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=40,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    shear_range=0.2,
    brightness_range=[0.7, 1.3],
    horizontal_flip=True,
    vertical_flip=True,
    fill_mode="nearest",
    validation_split=0.1  # Use 10% of training data as validation
)

val_datagen = ImageDataGenerator(rescale=1./255)

# Load and augment training data
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical",
    shuffle=True,
    subset='training'
)

# Create validation generator from training data
validation_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical",
    shuffle=True,
    subset='validation'
)

# Separate validation set
val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical",
    shuffle=False  # Don't shuffle for evaluation
)

print("✅ Classes detected:", train_generator.class_indices)

# Save class indices for prediction
with open(class_indices_path, 'w') as f:
    json.dump(train_generator.class_indices, f, indent=4)

# --------------------------
# Create Advanced Model Architecture
# --------------------------
print("🧠 Creating new EfficientNetV2S model...")
base_model = EfficientNetV2S(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3),
    pooling="avg"
)

# Freeze base model layers
base_model.trainable = False

# Create advanced model architecture
x = tf.keras.layers.Dense(512, activation="relu")(base_model.output)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.5)(x)
x = tf.keras.layers.Dense(256, activation="relu")(x)
x = tf.keras.layers.BatchNormalization()(x)
x = tf.keras.layers.Dropout(0.3)(x)
output = tf.keras.layers.Dense(len(train_generator.class_indices), activation="softmax")(x)

model = tf.keras.Model(inputs=base_model.input, outputs=output)

# --------------------------
# Advanced Training Strategy
# --------------------------
def create_callbacks(model_path):
    return [
        ModelCheckpoint(
            model_path,
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1
        ),
        EarlyStopping(
            monitor="val_loss",
            patience=8,  # Increased patience
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,  # More aggressive LR reduction
            patience=4,
            min_lr=1e-8,
            verbose=1
        )
    ]

# Initial training with frozen base
print("Phase 1: Training top layers...")
model = tf.keras.Model(inputs=base_model.input, outputs=output)
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=initial_learning_rate),
    loss="categorical_crossentropy",
    metrics=["accuracy", tf.keras.metrics.AUC()]
)

# First training phase
history1 = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=int(epochs/2),
    callbacks=create_callbacks(model_path),
    verbose=1
)

# Fine-tuning phase
print("Phase 2: Fine-tuning with unfrozen layers...")
base_model.trainable = True

# Freeze initial layers, unfreeze later layers for fine-tuning
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Recompile with lower learning rate for fine-tuning
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=initial_learning_rate/10),
    loss="categorical_crossentropy",
    metrics=["accuracy", tf.keras.metrics.AUC()]
)

# --------------------------
# Final Training Phase
# --------------------------
history2 = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=int(epochs/2),
    callbacks=create_callbacks(model_path),
    verbose=1
)

# --------------------------
# Evaluate on Validation Set
# --------------------------
print("Evaluating on validation set...")
val_results = model.evaluate(val_generator, verbose=1)
print(f"Validation Accuracy: {val_results[1]*100:.2f}%")
print(f"Validation AUC: {val_results[2]*100:.2f}%")

# Generate predictions for confusion matrix
y_pred = []
y_true = []

for i in range(len(val_generator)):
    images, labels = val_generator[i]
    predictions = model.predict(images)
    y_pred.extend(np.argmax(predictions, axis=1))
    y_true.extend(np.argmax(labels, axis=1))
    if i >= len(val_generator)-1:
        break

# Plot confusion matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(12, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.savefig('confusion_matrix.png')
plt.close()

# Plot training history
plt.figure(figsize=(15, 5))

# Accuracy plot
plt.subplot(1, 3, 1)
plt.plot(history1.history['accuracy'] + history2.history['accuracy'], label='Train Acc')
plt.plot(history1.history['val_accuracy'] + history2.history['val_accuracy'], label='Val Acc')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

# Loss plot
plt.subplot(1, 3, 2)
plt.plot(history1.history['loss'] + history2.history['loss'], label='Train Loss')
plt.plot(history1.history['val_loss'] + history2.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

# AUC plot
plt.subplot(1, 3, 3)
plt.plot(history1.history['auc'] + history2.history['auc'], label='Train AUC')
plt.plot(history1.history['val_auc'] + history2.history['val_auc'], label='Val AUC')
plt.title('Model AUC')
plt.xlabel('Epoch')
plt.ylabel('AUC')
plt.legend()

plt.tight_layout()
plt.savefig('training_history.png')
plt.show()

print("✅ Training complete! Best model saved as food_model.keras")
print("📊 Training visualizations saved as confusion_matrix.png and training_history.png")
