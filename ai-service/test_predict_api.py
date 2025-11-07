import os
import glob
import requests
import json

API_URL = "http://localhost:5001/predict"
BASE = "datasets/mydataset/train"

# Gather up to 3 fresh and 3 spoiled images
fresh_imgs = []
spoiled_imgs = []
for path in glob.glob(os.path.join(BASE, "*", "*.jpg")):
    dir_name = os.path.basename(os.path.dirname(path))
    if dir_name.startswith('fresh') and len(fresh_imgs) < 3:
        fresh_imgs.append(path)
    elif dir_name.startswith('spoiled') and len(spoiled_imgs) < 3:
        spoiled_imgs.append(path)
    if len(fresh_imgs) >= 3 and len(spoiled_imgs) >= 3:
        break

sample_images = fresh_imgs + spoiled_imgs

if not sample_images:
    print("No sample images found in", BASE)
    exit(1)

results = []
for img_path in sample_images:
    print("Testing:", img_path)
    with open(img_path, 'rb') as f:
        files = {'file': (os.path.basename(img_path), f, 'image/jpeg')}
        try:
            r = requests.post(API_URL, files=files, timeout=20)
        except Exception as e:
            print("Request failed:", e)
            results.append({"image": img_path, "error": str(e)})
            continue
    try:
        data = r.json()
    except Exception as e:
        print("Invalid JSON response", r.text)
        results.append({"image": img_path, "status_code": r.status_code, "text": r.text})
        continue
    print("=>", data)
    results.append({"image": img_path, "response": data})

# Save results
out_path = "ai_service_predict_test_results.json"
with open(out_path, 'w') as outf:
    json.dump(results, outf, indent=2)

print("Saved results to", out_path)
