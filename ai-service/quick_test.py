import requests
import os

def test_prediction():
    # Get a test image from our dataset
    test_image_path = os.path.join('datasets', 'mydataset', 'train', 'fresh', os.listdir(os.path.join('datasets', 'mydataset', 'train', 'fresh'))[0])
    
    if not os.path.exists(test_image_path):
        print(f"❌ Test image not found at {test_image_path}")
        return
        
    print(f"✅ Using test image: {test_image_path}")
    
    # Create the files payload
    files = {
        'file': ('test_image.jpg', open(test_image_path, 'rb'), 'image/jpeg')
    }
    
    try:
        # Make the request
        response = requests.post('http://localhost:5001/predict', files=files)
        
        # Print the status code
        print(f"Status Code: {response.status_code}")
        
        # Try to get JSON response
        try:
            print("Response JSON:", response.json())
        except:
            print("Raw Response:", response.text)
            
    except Exception as e:
        print(f"❌ Error making request: {str(e)}")
    
    finally:
        files['file'][1].close()

if __name__ == "__main__":
    test_prediction()