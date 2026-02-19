from typing import List
import logging
from app.llm.providers.base import BaseLLMProvider

logger = logging.getLogger(__name__)

class FallbackManager:

    @staticmethod
    async def try_providers(providers: List[BaseLLMProvider], prompt: str) -> str:
        for provider in providers:
            try:
                logger.info("[FALLBACK] Trying provider: %s", provider.__class__.__name__)
                result = await provider.generate(prompt)
                logger.info("[FALLBACK] SUCCESS with provider: %s", provider.__class__.__name__)
                return result
            except Exception as e:
                logger.warning("[FALLBACK] Provider %s failed: %s", provider.__class__.__name__, e)
                continue
        raise Exception("All LLM providers failed")

