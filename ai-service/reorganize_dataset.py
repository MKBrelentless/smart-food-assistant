import os
import shutil

# Base dataset path
base_dir = "datasets/mydataset"

# Target folder names
target_classes = ["fresh", "spoiled"]

# Create target directories if they don’t exist
for split in ["train", "val"]:
    for cls in target_classes:
        target_dir = os.path.join(base_dir, split, cls)
        os.makedirs(target_dir, exist_ok=True)

# Move all "fresh_*" and "spoiled_*" images
for split in ["train", "val"]:
    split_dir = os.path.join(base_dir, split)
    for folder in os.listdir(split_dir):
        folder_path = os.path.join(split_dir, folder)
        if not os.path.isdir(folder_path):
            continue

        if folder.startswith("fresh_"):
            dest_dir = os.path.join(split_dir, "fresh")
        elif folder.startswith("spoiled_"):
            dest_dir = os.path.join(split_dir, "spoiled")
        else:
            print(f"⚠️ Skipping unknown folder: {folder}")
            continue

        # Move files
        for file in os.listdir(folder_path):
            src_file = os.path.join(folder_path, file)
            dest_file = os.path.join(dest_dir, file)
            try:
                shutil.move(src_file, dest_file)
            except Exception as e:
                print(f"Error moving {file}: {e}")

        # Remove empty folder
        try:
            os.rmdir(folder_path)
            print(f"🧹 Removed folder: {folder_path}")
        except OSError:
            print(f"⚠️ Could not remove {folder_path} (not empty or in use)")

print("✅ Dataset successfully reorganized into 'fresh' and 'spoiled' folders!")
