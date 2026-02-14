import httpx
import json
from app.core.config import settings
from app.llm.providers.base import BaseLLMProvider

class SarvamProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = settings.SARVAM_API_KEY
        if not self.api_key:
             raise ValueError("SARVAM_API_KEY not set")
        self.base_url = "https://api.sarvam.ai/v1/chat/completions" 
        
    async def generate(self, prompt: str) -> str:
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": f"{self.api_key}" 
        }
        
        # Sarvam usually supports OpenAI compatible schema
        payload = {
            "model": "sarvam-2b", # Using a known model like sarvam-2b (often aliased but verified sarvam-m works too)
            # Actually let's use the one that definitely worked: sarvam-m
            "model": "sarvam-m",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1024,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url, 
                    headers=headers, 
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Handling OpenAI format response
                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"]
                elif "content" in data:
                    return data["content"]
                else:
                    raise Exception(f"Unexpected response format: {data}")
                    
            except httpx.HTTPStatusError as e:
                print(f"Sarvam API Error: {e.response.text}")
                raise e
            except Exception as e:
                print(f"Sarvam Provider Error: {e}")
                raise e
