import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
print(f"API Key found: {api_key[:10]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("❌ GOOGLE_API_KEY not found")
else:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash') # Use flash for faster test
        response = model.generate_content("Say hello")
        print(f"✅ Gemini Success: {response.text}")
    except Exception as e:
        print(f"❌ Gemini Failed: {str(e)}")
