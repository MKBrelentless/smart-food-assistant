import os
import shutil
import zipfile
import requests
from pathlib import Path

def download_and_extract_dataset():
    """Download sample food images and organize them into fresh/spoiled categories."""
    # Create directories if they don't exist
    base_dir = Path("datasets/mydataset")
    for split in ["train", "val"]:
        for category in ["fresh", "spoiled"]:
            (base_dir / split / category).mkdir(parents=True, exist_ok=True)

    # Download sample images for fresh food
    fresh_urls = [
        "https://example.com/fresh_apple.jpg",
        "https://example.com/fresh_bread.jpg",
        # Add more URLs for fresh food images
    ]

    spoiled_urls = [
        "https://example.com/spoiled_apple.jpg",
        "https://example.com/spoiled_bread.jpg",
        # Add more URLs for spoiled food images
    ]

    def download_image(url, path):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                with open(path, 'wb') as f:
                    f.write(response.content)
                return True
        except Exception as e:
            print(f"Error downloading {url}: {e}")
        return False

    # Download and organize images
    for i, url in enumerate(fresh_urls):
        train_path = base_dir / "train" / "fresh" / f"fresh_{i}.jpg"
        if download_image(url, train_path):
            print(f"Downloaded fresh image {i} to train set")

    for i, url in enumerate(spoiled_urls):
        train_path = base_dir / "train" / "spoiled" / f"spoiled_{i}.jpg"
        if download_image(url, train_path):
            print(f"Downloaded spoiled image {i} to train set")

    # Move some images to validation set
    def move_to_val(category):
        src_dir = base_dir / "train" / category
        dst_dir = base_dir / "val" / category
        files = list(src_dir.glob("*.jpg"))[:len(files)//5]  # Move 20% to validation
        for file in files:
            shutil.move(str(file), str(dst_dir / file.name))

    move_to_val("fresh")
    move_to_val("spoiled")

if __name__ == "__main__":
    download_and_extract_dataset()