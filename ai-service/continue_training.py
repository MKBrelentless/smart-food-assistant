import os
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

# ==============================================================
# Paths
# ==============================================================
BASE_DIR = os.path.join(os.path.dirname(__file__), "datasets", "mydataset")
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR = os.path.join(BASE_DIR, "val")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "food_model.keras")

# ==============================================================
# Verify dataset directories
# ==============================================================
if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(f"❌ Training directory not found: {TRAIN_DIR}")
if not os.path.exists(VAL_DIR):
    raise FileNotFoundError(f"❌ Validation directory not found: {VAL_DIR}")

print("✅ Dataset directories found.")
print(f"Training path: {TRAIN_DIR}")
print(f"Validation path: {VAL_DIR}")

# ==============================================================
# Parameters
# ==============================================================
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 25

# ==============================================================
# Load datasets
# ==============================================================
print("📂 Loading dataset...")

# ⚠️ Force RGB to prevent grayscale mismatch with EfficientNet
train_ds = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    color_mode="rgb"
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    color_mode="rgb"
)

class_names = train_ds.class_names
print(f"✅ Classes detected: {class_names}")

# Normalize and optimize datasets
train_ds = train_ds.map(lambda x, y: (x / 255.0, y)).prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (x / 255.0, y)).prefetch(tf.data.AUTOTUNE)

# ==============================================================
# Model Setup
# ==============================================================
if os.path.exists(MODEL_PATH):
    print("🔄 Found existing model — resuming training...")
    model = tf.keras.models.load_model(MODEL_PATH)
else:
    print("🧠 Creating new EfficientNetB0 model with pretrained weights...")
    base_model = tf.keras.applications.EfficientNetB0(
        weights="imagenet",  # ✅ pretrained for better results
        include_top=False,
        input_shape=(224, 224, 3),
        pooling="avg"
    )
    base_model.trainable = True  # fine-tune all layers

    # Add classification head
    x = layers.Dense(256, activation="relu")(base_model.output)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.4)(x)
    output = layers.Dense(len(class_names), activation="softmax")(x)

    model = models.Model(inputs=base_model.input, outputs=output)

# ==============================================================
# Compile model
# ==============================================================
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ==============================================================
# Callbacks
# ==============================================================
checkpoint = ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=6,
    restore_best_weights=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.5,
    patience=3,
    min_lr=1e-7,
    verbose=1
)

# ==============================================================
# Train / Continue training
# ==============================================================
print("\n🚀 Starting (or continuing) training...\n")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop, reduce_lr]
)

# ==============================================================
# Plot Training Curves
# ==============================================================
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history["accuracy"], label="Train Acc")
plt.plot(history.history["val_accuracy"], label="Val Acc")
plt.title("Accuracy")
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history["loss"], label="Train Loss")
plt.plot(history.history["val_loss"], label="Val Loss")
plt.title("Loss")
plt.legend()

plt.tight_layout()
plt.show()

print(f"\n✅ Training complete! Best model saved as {MODEL_PATH}")
