from typing import List
from app.llm.providers.base import BaseLLMProvider

class FallbackManager:

    @staticmethod
    async def try_providers(providers: List[BaseLLMProvider], prompt: str) -> str:
        for provider in providers:
            try:
                print(f"🔄 Trying provider: {provider.__class__.__name__}")
                result = await provider.generate(prompt)
                print(f"✅ SUCCESS with provider: {provider.__class__.__name__}")
                return result
            except Exception as e:
                # Log the error here
                print(f"❌ Provider {provider.__class__.__name__} failed: {e}")
                continue
        raise Exception("All LLM providers failed")
