import os
import requests
from PIL import Image
import base64
from io import BytesIO

def test_single_image(image_path):
    """Test the prediction API with a single image"""
    # Convert image to base64
    with open(image_path, 'rb') as image_file:
        img_str = base64.b64encode(image_file.read()).decode()
    
    # Make prediction request
    url = 'http://localhost:5001/predict'
    payload = {'image': img_str}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"\nResults for {os.path.basename(image_path)}:")
            print(f"Prediction: {result['prediction']}")
            print(f"Confidence: {result['confidence']:.2f}%")
            return result
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    # Test with a single fresh bread image
    test_image = "datasets/mydataset/train/fresh_bread/bread_fresh_1.jpg"
    if os.path.exists(test_image):
        test_single_image(test_image)
    else:
        print(f"Test image not found: {test_image}")