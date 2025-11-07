import os
import shutil

def flatten_dataset(base_dir):
    for category in ["Fresh", "Spoiled"]:
        folder = os.path.join(base_dir, category)
        if not os.path.exists(folder):
            continue

        for sub in os.listdir(folder):
            subfolder = os.path.join(folder, sub)
            if os.path.isdir(subfolder):
                # Move all files from subfolder → main category folder
                for file in os.listdir(subfolder):
                    src = os.path.join(subfolder, file)
                    dst = os.path.join(folder, file)

                    # If file already exists, rename to avoid overwrite
                    if os.path.exists(dst):
                        name, ext = os.path.splitext(file)
                        dst = os.path.join(folder, f"{name}_copy{ext}")

                    shutil.move(src, dst)

                # Remove empty subfolder
                os.rmdir(subfolder)

# Paths to your train and validation folders
flatten_dataset(r"C:\Users\Austine Mukabwa\OneDrive\Desktop\smart-food-assistant\ai-service\data\train")
flatten_dataset(r"C:\Users\Austine Mukabwa\OneDrive\Desktop\smart-food-assistant\ai-service\data\val")

print("✅ Dataset flattened! All images are now directly inside Fresh/ and Spoiled/")

