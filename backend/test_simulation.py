"""
Quick test to verify the simulation endpoint is accessible from the frontend.
Run this to confirm the backend is working correctly.
"""
import requests

print("=" * 60)
print("TESTING SIMULATION ENDPOINT")
print("=" * 60)

# Test the endpoint
url = "http://127.0.0.1:8000/api/v1/simulation/generate"
test_data = {
    "topic": "Pendulum Swing",
    "grade": "High School",
    "complexity": "Standard"
}

try:
    print(f"\n✅ Sending request to: {url}")
    response = requests.post(url, json=test_data, timeout=10)
    
    print(f"\n📊 Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! Simulation endpoint is working!")
        print("\nResponse data:")
        import json
        data = response.json()
        print(json.dumps(data, indent=2))
    else:
        print(f"\n❌ ERROR: Got status {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Could not connect to backend!")
    print("Make sure uvicorn is running on port 8000")
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "=" * 60)
print("If you see SUCCESS above, the backend is working!")
print("If the frontend still shows 404:")
print("1. Hard refresh the browser (Ctrl+Shift+R)")
print("2. Clear browser cache")
print("3. Restart the frontend (npm run dev)")
print("=" * 60)
