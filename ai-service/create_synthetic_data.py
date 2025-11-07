import os
import numpy as np
from PIL import Image

def create_synthetic_images():
    """Create synthetic images for testing the model."""
    base_dir = "datasets/mydataset"
    
    # Create simple patterns for fresh and spoiled food
    def create_fresh_image(size=(224, 224)):
        # Create a bright, colorful image
        img = np.zeros((size[0], size[1], 3), dtype=np.uint8)
        # Add some green/yellow patterns
        img[:, :, 1] = np.random.randint(200, 256, size=(size[0], size[1]))  # Green channel
        img[:, :, 0] = np.random.randint(150, 200, size=(size[0], size[1]))  # Red channel
        return Image.fromarray(img)

    def create_spoiled_image(size=(224, 224)):
        # Create a darker image with brown/black spots
        img = np.zeros((size[0], size[1], 3), dtype=np.uint8)
        # Add brown/black patterns
        img[:, :, 0] = np.random.randint(50, 100, size=(size[0], size[1]))  # Red channel
        img[:, :, 1] = np.random.randint(30, 80, size=(size[0], size[1]))   # Green channel
        # Add some spots
        spots = np.random.rand(size[0], size[1]) > 0.8
        img[spots] = [20, 20, 20]
        return Image.fromarray(img)

    # Create images for each split and category
    splits = ['train', 'val']
    nums = {'train': 100, 'val': 20}  # Number of images per category

    for split in splits:
        print(f"Creating {split} images...")
        
        # Fresh images
        fresh_dir = os.path.join(base_dir, split, 'fresh')
        os.makedirs(fresh_dir, exist_ok=True)
        for i in range(nums[split]):
            img = create_fresh_image()
            img.save(os.path.join(fresh_dir, f'fresh_food_{i}.jpg'))

        # Spoiled images
        spoiled_dir = os.path.join(base_dir, split, 'spoiled')
        os.makedirs(spoiled_dir, exist_ok=True)
        for i in range(nums[split]):
            img = create_spoiled_image()
            img.save(os.path.join(spoiled_dir, f'spoiled_food_{i}.jpg'))

    print("✅ Synthetic dataset created successfully!")

if __name__ == "__main__":
    create_synthetic_images()