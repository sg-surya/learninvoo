import httpx
import logging
from app.core.config import settings
from app.llm.providers.base import BaseLLMProvider

logger = logging.getLogger(__name__)


class SarvamProvider(BaseLLMProvider):
    """Sarvam AI LLM Provider — Primary provider for Learnivo."""
    
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        if not self.api_key:
            raise ValueError("SARVAM_API_KEY not set in environment variables")
        self.base_url = "https://api.sarvam.ai/v1/chat/completions"
        self.model = "sarvam-m"
        logger.info("[SARVAM] Initialized with model: %s", self.model)
        
    async def generate(self, prompt: str) -> str:
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": self.api_key
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2048,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            try:
                logger.info("[SARVAM] Sending request to %s with model %s", self.base_url, self.model)
                response = await client.post(
                    self.base_url, 
                    headers=headers, 
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                # OpenAI-compatible response format
                if "choices" in data and len(data["choices"]) > 0:
                    content = data["choices"][0]["message"]["content"]
                    logger.info("[SARVAM] Response received successfully (%d chars)", len(content))
                    return content
                elif "content" in data:
                    return data["content"]
                else:
                    raise Exception(f"Unexpected Sarvam response format: {list(data.keys())}")
                    
            except httpx.HTTPStatusError as e:
                error_text = e.response.text[:200] if e.response else "No response"
                logger.error("[SARVAM] API Error %d: %s", e.response.status_code, error_text)
                raise Exception(f"Sarvam API Error ({e.response.status_code}): {error_text}")
            except httpx.TimeoutException:
                logger.error("[SARVAM] Request timed out after 30s")
                raise Exception("Sarvam API request timed out")
            except Exception as e:
                logger.error("[SARVAM] Provider Error: %s", str(e)[:200])
                raise e
