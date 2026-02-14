from app.llm.providers.openai_provider import OpenAIProvider
from app.llm.providers.sarvam_provider import SarvamProvider
from app.llm.providers.fireworks_provider import FireworksProvider
from app.llm.providers.mock_provider import MockProvider
from app.llm.fallback_manager import FallbackManager

class LLMRouter:

    def __init__(self):
        self.providers = []
        
        # Priority 1: Fireworks AI (Llama 3 70B)
        try:
            self.providers.append(FireworksProvider())
        except Exception:
            pass

        # Priority 2: Sarvam AI
        try:
            self.providers.append(SarvamProvider())
        except Exception:
            pass
            
        # Priority 3: OpenAI (if configured)
        try:
            self.providers.append(OpenAIProvider())
        except Exception:
            pass

        # Fallback: Mock Provider
        self.providers.append(MockProvider())
        
    async def generate(self, prompt: str) -> str:
        return await FallbackManager.try_providers(self.providers, prompt)
