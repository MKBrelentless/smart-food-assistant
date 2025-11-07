import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
import random
import tensorflow as tf
from tensorflow.keras.preprocessing.image import random_rotation, random_zoom, random_brightness

def create_gradient(size, color1, color2):
    """Create a gradient background."""
    image = Image.new('RGB', (size[0], size[1]))
    for y in range(size[1]):
        r = int(color1[0] + (color2[0] - color1[0]) * y / size[1])
        g = int(color1[1] + (color2[1] - color1[1]) * y / size[1])
        b = int(color1[2] + (color2[2] - color1[2]) * y / size[1])
        for x in range(size[0]):
            image.putpixel((x, y), (r, g, b))
    return image

def add_noise(image, intensity=20):
    """Add random noise to image."""
    pixels = np.array(image)
    noise = np.random.normal(0, intensity, pixels.shape)
    pixels = pixels + noise
    pixels = np.clip(pixels, 0, 255)
    return Image.fromarray(pixels.astype('uint8'))

def create_food_texture(category, condition, base_color, size=(224, 224)):
    """Create realistic food textures."""
    texture = Image.new('RGB', (size[0], size[1]))
    draw = ImageDraw.Draw(texture)
    
    if condition == 'fresh':
        # Fresh food textures
        for _ in range(100):
            x = random.randint(0, size[0])
            y = random.randint(0, size[1])
            r = random.randint(2, 8)
            color = (
                min(255, base_color[0] + random.randint(-20, 20)),
                min(255, base_color[1] + random.randint(-20, 20)),
                min(255, base_color[2] + random.randint(-20, 20))
            )
            draw.ellipse([x-r, y-r, x+r, y+r], fill=color)
    else:
        # Spoiled food textures
        for _ in range(150):
            x = random.randint(0, size[0])
            y = random.randint(0, size[1])
            r = random.randint(3, 12)
            if random.random() < 0.7:  # 70% darker spots
                color = (
                    max(0, base_color[0] - random.randint(20, 50)),
                    max(0, base_color[1] - random.randint(20, 50)),
                    max(0, base_color[2] - random.randint(20, 50))
                )
            else:  # 30% mold-like spots
                color = (
                    random.randint(70, 100),
                    random.randint(70, 100),
                    random.randint(50, 80)
                )
            draw.ellipse([x-r, y-r, x+r, y+r], fill=color)
    
    return texture

def create_enhanced_food_image(category, condition, size=(224, 224)):
    """Create highly realistic synthetic food images."""
    # Base colors for different categories
    colors = {
        'bread': {
            'fresh': (210, 180, 140),
            'spoiled': (160, 140, 100)
        },
        'fruits': {
            'fresh': (255, 50, 50),
            'spoiled': (139, 69, 19)
        },
        'vegetables': {
            'fresh': (34, 139, 34),
            'spoiled': (85, 107, 47)
        },
        'dairy': {
            'fresh': (255, 253, 208),
            'spoiled': (189, 183, 107)
        }
    }
    
    # Create base shape
    base_color = colors[category][condition]
    image = Image.new('RGB', (size[0], size[1]), base_color)
    draw = ImageDraw.Draw(image)
    
    # Add category-specific shapes and textures
    if category == 'bread':
        # Create bread shape with layers
        for i in range(3):
            offset = i * 10
            draw.ellipse([40+offset, 40+offset, 184-offset, 184-offset], 
                        fill=tuple(c - offset*5 for c in base_color))
    
    elif category == 'fruits':
        # Create rounded fruit shape
        draw.ellipse([50, 50, 174, 174], fill=base_color)
        if condition == 'fresh':
            # Add highlight
            draw.ellipse([70, 70, 90, 90], fill=(255, 255, 255))
    
    elif category == 'vegetables':
        # Create vegetable shape
        draw.rectangle([50, 50, 174, 174], fill=base_color)
        if condition == 'fresh':
            # Add leaf-like patterns
            for _ in range(5):
                x = random.randint(60, 164)
                y = random.randint(60, 164)
                draw.arc([x, y, x+30, y+30], 0, 180, fill=(0, 100, 0))
    
    elif category == 'dairy':
        # Create dairy product container
        draw.rectangle([40, 60, 184, 164], fill=base_color)
        if condition == 'fresh':
            # Add creamy texture
            for _ in range(30):
                x = random.randint(45, 179)
                y = random.randint(65, 159)
                size = random.randint(2, 5)
                draw.ellipse([x, y, x+size, y+size], 
                            fill=tuple(min(255, c + 20) for c in base_color))
    
    # Add texture overlay
    texture = create_food_texture(category, condition, base_color, size)
    image = Image.blend(image, texture, 0.3)
    
    # Add noise and apply filters
    image = add_noise(image, intensity=10 if condition == 'fresh' else 20)
    
    # Apply final enhancements
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.2 if condition == 'fresh' else 0.8)
    
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(1.3 if condition == 'fresh' else 0.7)
    
    if condition == 'spoiled':
        image = image.filter(ImageFilter.GaussianBlur(radius=1))
    
    return image

def generate_enhanced_dataset(base_path, num_images=200):
    """Generate enhanced synthetic dataset with multiple categories."""
    categories = ['bread', 'fruits', 'vegetables', 'dairy']
    conditions = ['fresh', 'spoiled']
    splits = ['train', 'val']
    
    # Create directory structure
    for split in splits:
        for condition in conditions:
            for category in categories:
                dir_path = os.path.join(base_path, split, f"{condition}_{category}")
                os.makedirs(dir_path, exist_ok=True)
                
                # Generate images
                num_split_images = num_images if split == 'train' else num_images // 5
                for i in range(num_split_images):
                    img = create_enhanced_food_image(category, condition)
                    
                    # Apply random augmentations
                    img_array = np.array(img)
                    img_array = random_rotation(img_array, 20, row_axis=0, col_axis=1, channel_axis=2)
                    img_array = random_zoom(img_array, (0.8, 1.2), row_axis=0, col_axis=1, channel_axis=2)
                    img_array = random_brightness(img_array, (0.8, 1.2))
                    
                    img = Image.fromarray(img_array.astype('uint8'))
                    img_path = os.path.join(dir_path, f"{category}_{condition}_{i+1}.jpg")
                    img.save(img_path, 'JPEG')
                    print(f"Created: {img_path}")

if __name__ == "__main__":
    base_path = "datasets/mydataset"
    print("Generating enhanced synthetic dataset...")
    generate_enhanced_dataset(base_path, num_images=250)  # Generate 250 images per category
    print("Dataset generation complete!")