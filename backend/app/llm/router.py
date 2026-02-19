from app.llm.providers.google_provider import GoogleProvider
from app.llm.fallback_manager import FallbackManager
import logging

logger = logging.getLogger(__name__)


class LLMRouter:
    """Singleton LLM Router - Only Google Gemini provider."""
    
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
        
        # Google Gemini — Primary and only provider
        logger.info("[INIT] Initializing Google Gemini Provider...")
        try:
            self.providers.append(GoogleProvider())
            logger.info("[OK] Google Gemini Provider loaded successfully")
        except Exception as e:
            logger.error("[FAIL] Google Provider failed to initialize: %s", str(e))

        logger.info("[READY] LLMRouter initialized with %d provider(s)", len(self.providers))
        self._initialized = True

    async def generate(self, prompt: str) -> str:
        return await FallbackManager.try_providers(self.providers, prompt)
