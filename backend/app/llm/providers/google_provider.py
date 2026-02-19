from google import genai
import os
import asyncio
import logging
import re
from concurrent.futures import ThreadPoolExecutor
from app.llm.providers.base import BaseLLMProvider
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

_executor = ThreadPoolExecutor(max_workers=3)


class GoogleProvider(BaseLLMProvider):
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        self.client = genai.Client(api_key=api_key)
        self.preferred_model = os.getenv("GOOGLE_LLM_MODEL", "gemini-2.0-flash")
        logger.info("[GEMINI] Initialized with model: %s", self.preferred_model)
            
    def _sync_generate(self, model: str, prompt: str) -> str:
        """Blocking call — runs in thread pool"""
        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
        )
        if response and response.text:
            return response.text
        raise Exception("Gemini returned an empty response")

    def _extract_retry_delay(self, error_str: str) -> float:
        """Extract retry delay from Google API error message"""
        match = re.search(r'retry\s*(?:in\s*)?(\d+\.?\d*)\s*s', error_str.lower())
        if match:
            return min(float(match.group(1)), 30.0)  # Cap at 30s
        return 0

    async def generate(self, prompt: str) -> str:
        loop = asyncio.get_event_loop()
        last_error = None
        
        # Try up to 2 times with retry for rate limiting
        for attempt in range(2):
            try:
                model = self.preferred_model
                logger.info("[GEMINI] Attempt %d with model: %s", attempt + 1, model)
                
                result = await asyncio.wait_for(
                    loop.run_in_executor(_executor, self._sync_generate, model, prompt),
                    timeout=25.0
                )
                return result
                
            except asyncio.TimeoutError:
                logger.error("[GEMINI] Timeout after 25s (attempt %d)", attempt + 1)
                last_error = Exception(f"Gemini timed out after 25s")
                
            except Exception as e:
                error_str = str(e)
                last_error = e
                logger.error("[GEMINI] Error (attempt %d): %s", attempt + 1, error_str[:300])
                
                # If rate limited, wait and retry
                if "429" in error_str or "resource_exhausted" in error_str.lower() or "quota" in error_str.lower():
                    retry_delay = self._extract_retry_delay(error_str)
                    if retry_delay > 0 and attempt == 0:
                        logger.info("[GEMINI] Rate limited. Waiting %.1fs before retry...", retry_delay)
                        await asyncio.sleep(retry_delay)
                        continue
                    else:
                        # Quota fully exhausted, no point retrying
                        raise Exception(
                            "Google Gemini API quota exceeded. Your free tier daily limit has been reached. "
                            "Please wait for quota reset (usually 24 hours) or upgrade your API plan at "
                            "https://aistudio.google.com. You can also generate a new API key."
                        )
                
                # For model not found, try fallback model
                if "not found" in error_str.lower() or "404" in error_str.lower():
                    if self.preferred_model != "gemini-1.5-flash":
                        try:
                            logger.info("[GEMINI] Trying fallback model: gemini-1.5-flash")
                            result = await asyncio.wait_for(
                                loop.run_in_executor(_executor, self._sync_generate, "gemini-1.5-flash", prompt),
                                timeout=25.0
                            )
                            return result
                        except Exception as fe:
                            logger.warning("[GEMINI] Fallback model also failed: %s", str(fe)[:200])
                
                # Any other error, don't retry
                break
        
        raise last_error or Exception("Google Gemini failed to generate a response")
