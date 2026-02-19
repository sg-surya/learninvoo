import google.generativeai as genai
import os
from app.llm.providers.base import BaseLLMProvider
from dotenv import load_dotenv

load_dotenv()

class GoogleProvider(BaseLLMProvider):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        preferred_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-1.5-flash")
        
        # Try to verify the preferred model exists, otherwise pick first available
        try:
            self.model = genai.GenerativeModel(preferred_model)
            # We don't verify here as it might require a network call
        except Exception:
            # Fallback if initialization fails
            self.model = genai.GenerativeModel("gemini-pro")
            
    async def generate(self, prompt: str) -> str:
        try:
            # Ensure model name is clean
            response = self.model.generate_content(prompt)
            if response and response.text:
                return response.text
            raise Exception("Gemini returned an empty response")
        except Exception as e:
            # If 1.5 fails, try a very basic fallback to 'gemini-pro' or 'gemini-1.0-pro'
            if "404" in str(e) or "not found" in str(e).lower():
                 print(f"🔄 Model {self.model.model_name} not found, trying basic gemini-pro...")
                 try:
                     fallback_model = genai.GenerativeModel("gemini-pro")
                     response = fallback_model.generate_content(prompt)
                     return response.text
                 except Exception:
                     pass
            print(f"❌ Gemini Error: {str(e)}")
            raise e
