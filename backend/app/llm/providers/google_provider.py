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
            # TRY 1: Primary Model (from ENV or default)
            print(f"🚀 Gemini Attempt: {self.model.model_name}")
            response = await self.model.generate_content_async(prompt)
            if response and response.text:
                return response.text
            raise Exception("Gemini returned an empty response")
        except Exception as e:
            error_str = str(e).lower()
            print(f"❌ Gemini Primary Error ({self.model.model_name}): {error_str}")
            
            # TRY 2: Fallback to a very stable model if first one fails
            # Most common errors are 404 (wrong name) or 403 (quota/region)
            if "not found" in error_str or "404" in error_str or "unsupported" in error_str:
                fallback_names = ["gemini-1.5-flash-latest", "gemini-pro"]
                for model_name in fallback_names:
                    try:
                        print(f"🔄 Trying Gemini Fallback: {model_name}")
                        fallback_model = genai.GenerativeModel(model_name)
                        response = await fallback_model.generate_content_async(prompt)
                        if response and response.text:
                            return response.text
                    except Exception as fe:
                        print(f"⚠️ Fallback {model_name} also failed: {fe}")
            
            # If all attempts within this provider fail, re-raise to trigger FallbackManager (MockProvider)
            raise e

