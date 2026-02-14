from dotenv import load_dotenv
import requests
import json

load_dotenv()

url = "http://127.0.0.1:8000/api/v1/visual/generate"

payload = {
    "topic": "Photosynthesis",
    "grade": "High School", 
    "visual_style": "Scientific Diagram",
    "source_mode": "topic"
}

print("=" * 80)
print("TESTING VISUAL GENERATION - CHECKING PROMPTS")
print("=" * 80)
print(f"Topic: {payload['topic']}")
print(f"Style: {payload['visual_style']}")
print(f"Grade: {payload['grade']}")
print("\nCheck the backend terminal for [DEBUG] and [FIREWORKS] logs!\n")
print("=" * 80)

try:
    response = requests.post(url, json=payload, timeout=180)
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ SUCCESS! Got response:")
        print(f"Number of visuals: {len(data.get('visuals', []))}")
        
        for i, visual in enumerate(data.get('visuals', []), 1):
            print(f"\n{i}. URL: {visual['url']}")
            print(f"   Prompt used: {visual.get('prompt', 'N/A')[:100]}...")
    else:
        print(f"\n❌ ERROR {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"\n❌ FAILED: {e}")

print("\n" + "=" * 80)
print("NOW CHECK THE BACKEND TERMINAL TO SEE WHAT PROMPTS WERE GENERATED!")
print("=" * 80)
