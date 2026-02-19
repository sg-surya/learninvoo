import httpx
import os
from app.llm.providers.base import BaseLLMProvider
from dotenv import load_dotenv

load_dotenv()

class LocalProvider(BaseLLMProvider):
    def __init__(self):
        # Default to Ollama local endpoint
        self.api_url = os.getenv("LOCAL_LLM_URL", "http://localhost:11434/v1/chat/completions")
        self.model_name = os.getenv("LOCAL_LLM_MODEL", "llama3")

    async def generate(self, prompt: str) -> str:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.api_url,
                    json={
                        "model": self.model_name,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7
                    },
                    timeout=60.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                raise Exception(f"Local LLM Error: {response.status_code}")
        except Exception as e:
            print(f"❌ Local LLM Error: {str(e)}")
            raise e
