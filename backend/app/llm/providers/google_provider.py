from google import genai
import os
import logging
from app.llm.providers.base import BaseLLMProvider
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class GoogleProvider(BaseLLMProvider):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self.client = genai.Client(api_key=api_key)
        self.preferred_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-2.0-flash")
            
    async def generate(self, prompt: str) -> str:
        try:
            # TRY 1: Primary Model (from ENV or default)
            logger.info("[GEMINI] Attempt: %s", self.preferred_model)
            response = self.client.models.generate_content(
                model=self.preferred_model,
                contents=prompt,
            )
            if response and response.text:
                return response.text
            raise Exception("Gemini returned an empty response")
        except Exception as e:
            error_str = str(e).lower()
            logger.error("[GEMINI] Primary Error (%s): %s", self.preferred_model, error_str[:200])
            
            # TRY 2: Fallback to stable models if first one fails
            if "not found" in error_str or "404" in error_str or "unsupported" in error_str:
                fallback_names = ["gemini-2.0-flash", "gemini-1.5-flash"]
                for model_name in fallback_names:
                    if model_name == self.preferred_model:
                        continue
                    try:
                        logger.info("[GEMINI] Trying fallback: %s", model_name)
                        response = self.client.models.generate_content(
                            model=model_name,
                            contents=prompt,
                        )
                        if response and response.text:
                            return response.text
                    except Exception as fe:
                        logger.warning("[GEMINI] Fallback %s also failed: %s", model_name, fe)
            
            # If all attempts within this provider fail, re-raise to trigger FallbackManager
            raise e

