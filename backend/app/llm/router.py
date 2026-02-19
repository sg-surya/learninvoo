from app.llm.providers.sarvam_provider import SarvamProvider
from app.llm.providers.google_provider import GoogleProvider
from app.llm.fallback_manager import FallbackManager
import logging

logger = logging.getLogger(__name__)


class LLMRouter:
    """Singleton LLM Router — Sarvam AI (Primary) + Google Gemini (Fallback)."""
    
    _instance = None
    _lock = __import__('threading').Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._initialized = False
                    cls._instance = instance
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        self.providers = []
        
        # 1. Sarvam AI — Primary Provider
        try:
            self.providers.append(SarvamProvider())
            logger.info("[ROUTER] Sarvam AI loaded as PRIMARY provider")
        except Exception as e:
            logger.error("[ROUTER] Sarvam AI failed to init: %s", str(e))

        # 2. Google Gemini — Fallback Provider
        try:
            self.providers.append(GoogleProvider())
            logger.info("[ROUTER] Google Gemini loaded as FALLBACK provider")
        except Exception as e:
            logger.error("[ROUTER] Google Gemini failed to init: %s", str(e))

        logger.info("[ROUTER] Initialized with %d provider(s)", len(self.providers))
        self._initialized = True

    async def generate(self, prompt: str) -> str:
        if not self.providers:
            raise Exception("No LLM providers available. Check your API keys in .env")
        return await FallbackManager.try_providers(self.providers, prompt)
