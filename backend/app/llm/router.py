from app.llm.providers.google_provider import GoogleProvider
from app.llm.providers.local_provider import LocalProvider
from app.llm.providers.mock_provider import MockProvider
from app.llm.providers.fireworks_provider import FireworksProvider
from app.llm.fallback_manager import FallbackManager
import threading
import logging

logger = logging.getLogger(__name__)

class LLMRouter:
    """Singleton LLM Router — providers are initialized once and reused."""
    
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                # Double-check inside lock to prevent race conditions
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._initialized = False
                    cls._instance = instance
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        self.providers = []
        
        # Priority 1: Google Gemini (High Quality, requires internet)
        logger.info("[INIT] Initializing Google Provider...")
        try:
            self.providers.append(GoogleProvider())
            logger.info("[OK] Google Provider loaded successfully")
        except Exception as e:
            logger.warning("[SKIP] Google Provider skipped: %s", str(e))

        # Priority 2: Fireworks (Excellent Fallback)
        logger.info("[INIT] Initializing Fireworks Provider...")
        try:
            self.providers.append(FireworksProvider())
            logger.info("[OK] Fireworks Provider loaded successfully")
        except Exception as e:
            logger.warning("[SKIP] Fireworks Provider skipped: %s", str(e))

        # Priority 3: Local LLM (Responsive, no internet required)
        logger.info("[INIT] Initializing Local Provider...")
        try:
            self.providers.append(LocalProvider())
            logger.info("[OK] Local Provider loaded successfully")
        except Exception as e:
            logger.warning("[SKIP] Local Provider skipped: %s", str(e))

        # Fallback: Mock Provider (Always works)
        self.providers.append(MockProvider())
        
        logger.info("[READY] LLMRouter initialized with %d provider(s)", len(self.providers))
        self._initialized = True

    async def generate(self, prompt: str) -> str:
        return await FallbackManager.try_providers(self.providers, prompt)

