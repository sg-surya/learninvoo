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
            response = await self.client.chat.completions.create(
                model="accounts/fireworks/models/minimax-m2p1",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Fireworks Error: {e}")
            raise e
