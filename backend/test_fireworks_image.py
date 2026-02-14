from dotenv import load_dotenv
import os
import httpx
import asyncio

# Load .env file
load_dotenv()

async def test_fireworks_image():
    api_key = os.getenv("FIREWORKS_API_KEY")
    
    print(f"API Key present: {'Yes' if api_key else 'No'}")
    
    if not api_key:
        print("[ERROR] No Fireworks API key found!")
        return
    
    url = "https://api.fireworks.ai/inference/v1/images/generations"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "accounts/fireworks/models/flux-kontext-pro",
        "prompt": "A simple red apple on a white background, photorealistic, high quality",
        "n": 1,
        "size": "1024x1024",
        "response_format": "url"
    }
    
    print("\n[INFO] Testing Fireworks AI Image Generation...")
    print(f"Model: {payload['model']}")
    print(f"Prompt: {payload['prompt']}")
    
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            print("\n[INFO] Sending request...")
            response = await client.post(url, json=payload, headers=headers)
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n[SUCCESS] Image generated!")
                print(f"Image URL: {data['data'][0]['url']}")
            else:
                print(f"\n[FAILED] API returned error")
                print(f"Response: {response.text[:500]}")
                
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    asyncio.run(test_fireworks_image())
