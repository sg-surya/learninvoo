import requests
import json

url = "http://127.0.0.1:8000/api/v1/visual/generate"

payload = {
    "topic": "Water Cycle",
    "grade": "Middle School",
    "visual_style": "Scientific Diagram",
    "source_mode": "topic"
}

print("Testing Visual Generation API...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print("\n" + "="*60 + "\n")

try:
    response = requests.post(url, json=payload, timeout=90)
    
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse:")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        print("\n" + "="*60)
        print("IMAGE URLs:")
        for i, visual in enumerate(data.get("visuals", []), 1):
            print(f"{i}. {visual['url']}")
            if 'picsum' in visual['url']:
                print("   ⚠️ MOCK IMAGE DETECTED!")
            else:
                print("   ✅ Real AI-generated image")
    else:
        print(response.text)
        
except Exception as e:
    print(f"Error: {e}")
