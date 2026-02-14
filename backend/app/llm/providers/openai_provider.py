import openai
from app.core.config import settings
from app.llm.providers.base import BaseLLMProvider

class OpenAIProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        if not self.api_key:
             raise ValueError("OPENAI_API_KEY not set")
        self.client = openai.AsyncOpenAI(api_key=self.api_key)

    async def generate(self, prompt: str) -> str:
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Error: {e}")
            raise e
