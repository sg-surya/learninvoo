import requests
import json

url = "http://127.0.0.1:8000/api/v1/story/generate"
payload = {
    "topic": "A brave knight",
    "grade": "Elementary", 
    "genre": "Adventure",
    "length": "Short",
    "language": "English"
}

print("Testing story generation...")
response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
