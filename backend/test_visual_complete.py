from dotenv import load_dotenv
import requests
import json
import time

load_dotenv()

url = "http://127.0.0.1:8000/api/v1/visual/generate"

payload = {
    "topic": "Photosynthesis Process",
    "grade": "High School",
    "visual_style": "Scientific Diagram",
    "source_mode": "topic"
}

print("="*70)
print("TESTING VISUAL GENERATION API")
print("="*70)
print(f"\nEndpoint: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print("\nSending request... (this may take 30-60 seconds)")
print("="*70)

start_time = time.time()

try:
    response = requests.post(url, json=payload, timeout=180)
    elapsed = time.time() - start_time
    
    print(f"\n[RESPONSE RECEIVED in {elapsed:.1f} seconds]")
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        print("\n" + "="*70)
        print("CHECKING IMAGE URLS:")
        print("="*70)
        
        for i, visual in enumerate(data.get("visuals", []), 1):
            url = visual['url']
            print(f"\n{i}. {url}")
            
            if 'picsum' in url:
                print("   [MOCK] Still using placeholder image!")
            elif 'fireworks' in url or 'storage.googleapis.com' in url or 'cloudflare' in url:
                print("   [REAL] AI-generated image from Fireworks!")
            else:
                print("   [UNKNOWN] Different source")
    else:
        print(f"ERROR: {response.text}")
        
except requests.exceptions.Timeout:
    print("\n[TIMEOUT] Request took longer than 180 seconds")
except Exception as e:
    print(f"\n[ERROR] {e}")

print("\n" + "="*70)
