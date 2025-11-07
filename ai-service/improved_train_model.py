import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import EfficientNetV2B0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.metrics import confusion_matrix
import json

def create_model(num_classes):
    """Create an improved model architecture with EfficientNetV2B0."""
    # Base model
    base_model = EfficientNetV2B0(
        include_top=False,
        weights='imagenet',
        input_shape=(224, 224, 3),
        pooling='avg'
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Create model
    model = models.Sequential([
        base_model,
        layers.BatchNormalization(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def create_data_generators(train_dir, val_dir, batch_size=32):
    """Create data generators with enhanced augmentation."""
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.7, 1.3],
        fill_mode='nearest',
        validation_split=0.1
    )

    val_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=True,
        subset='training'
    )

    val_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=True,
        subset='validation'
    )

    test_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    return train_generator, val_generator, test_generator

def plot_training_history(history, save_path='training_history.png'):
    """Plot training metrics."""
    plt.figure(figsize=(15, 5))
    
    # Accuracy plot
    plt.subplot(1, 3, 1)
    plt.plot(history.history['accuracy'], label='Train')
    plt.plot(history.history['val_accuracy'], label='Validation')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    # Loss plot
    plt.subplot(1, 3, 2)
    plt.plot(history.history['loss'], label='Train')
    plt.plot(history.history['val_loss'], label='Validation')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    # Learning rate plot
    plt.subplot(1, 3, 3)
    plt.plot(history.history['lr'], label='Learning Rate')
    plt.title('Learning Rate')
    plt.xlabel('Epoch')
    plt.ylabel('Learning Rate')
    plt.yscale('log')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()

def plot_confusion_matrix(y_true, y_pred, classes, save_path='confusion_matrix.png'):
    """Plot confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=classes, yticklabels=classes)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()

def train_model(epochs=50, batch_size=32, initial_lr=1e-3):
    """Train the model with improved architecture and training strategy."""
    # Paths
    train_dir = "datasets/mydataset/train"
    val_dir = "datasets/mydataset/val"
    model_path = "food_model.keras"
    
    # Create data generators
    train_generator, val_generator, test_generator = create_data_generators(
        train_dir, val_dir, batch_size
    )
    
    # Create model
    model = create_model(num_classes=len(train_generator.class_indices))
    
    # Save class indices
    with open('class_indices.json', 'w') as f:
        json.dump(train_generator.class_indices, f, indent=4)
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            model_path,
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=initial_lr),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # First phase: Train only top layers
    print("Phase 1: Training top layers...")
    history1 = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=epochs//2,
        callbacks=callbacks,
        verbose=1
    )
    
    # Second phase: Fine-tune with unfrozen layers
    print("\nPhase 2: Fine-tuning with unfrozen layers...")
    model.layers[0].trainable = True
    
    # Freeze first layers, unfreeze later layers
    for layer in model.layers[0].layers[:-30]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=initial_lr/10),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history2 = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=epochs//2,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate on test set
    print("\nEvaluating on test set...")
    test_loss, test_accuracy = model.evaluate(test_generator, verbose=1)
    print(f"Test Accuracy: {test_accuracy*100:.2f}%")
    
    # Generate predictions for confusion matrix
    predictions = model.predict(test_generator)
    y_pred = np.argmax(predictions, axis=1)
    y_true = test_generator.classes
    
    # Plot training history and confusion matrix
    plot_training_history({
        'accuracy': history1.history['accuracy'] + history2.history['accuracy'],
        'val_accuracy': history1.history['val_accuracy'] + history2.history['val_accuracy'],
        'loss': history1.history['loss'] + history2.history['loss'],
        'val_loss': history1.history['val_loss'] + history2.history['val_loss'],
        'lr': history1.history.get('lr', []) + history2.history.get('lr', [])
    })
    
    plot_confusion_matrix(
        y_true,
        y_pred,
        classes=list(train_generator.class_indices.keys())
    )
    
    print("\n✅ Training complete!")
    print("📊 Training visualizations saved as training_history.png and confusion_matrix.png")

if __name__ == "__main__":
    train_model()