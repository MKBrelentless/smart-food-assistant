import os
from collections import Counter
import matplotlib.pyplot as plt

# --------------------------
# Folder Path
# --------------------------
base_dir = "datasets/mydataset/train"

# --------------------------
# Count Images Per Class
# --------------------------
classes = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
counts = Counter()

for cls in classes:
    path = os.path.join(base_dir, cls)
    num_images = len([f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    counts[cls] = num_images

# --------------------------
# Print Class Counts
# --------------------------
print("\n📊 TRAINING DATA BALANCE")
for cls, count in counts.items():
    print(f"{cls:20} -> {count} images")

print("\nTOTAL:", sum(counts.values()))

# --------------------------
# Visualize Class Distribution
# --------------------------
plt.figure(figsize=(10, 6))
plt.bar(counts.keys(), counts.values(), color="skyblue")
plt.xticks(rotation=45, ha="right")
plt.title("Dataset Class Distribution")
plt.xlabel("Class Name")
plt.ylabel("Number of Images")
plt.tight_layout()
plt.show()
