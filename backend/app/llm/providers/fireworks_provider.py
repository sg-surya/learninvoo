import openai
from app.core.config import settings
from app.llm.providers.base import BaseLLMProvider

class FireworksProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = settings.FIREWORKS_API_KEY
        if not self.api_key:
            raise ValueError("FIREWORKS_API_KEY not set")
            
        self.client = openai.AsyncOpenAI(
            api_key=self.api_key,
            base_url="https://api.fireworks.ai/inference/v1"
        )

    async def generate(self, prompt: str) -> str:
        try:
            print(f"🚀 Fireworks Attempt: llama-v3-70b-instruct")
            response = await self.client.chat.completions.create(
                model="accounts/fireworks/models/llama-v3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2048
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ Fireworks Error: {e}")
            raise e

