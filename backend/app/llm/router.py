from app.llm.providers.google_provider import GoogleProvider
from app.llm.providers.local_provider import LocalProvider
from app.llm.providers.mock_provider import MockProvider
from app.llm.providers.fireworks_provider import FireworksProvider
from app.llm.fallback_manager import FallbackManager

class LLMRouter:

    def __init__(self):
        self.providers = []
        
        # Priority 1: Google Gemini (High Quality, requires internet)
        print("🔍 Initializing Google Provider...")
        try:
            self.providers.append(GoogleProvider())
            print("✅ Google Provider loaded successfully")
        except Exception as e:
            print(f"⚠️ Google Provider skipped: {str(e)}")

        # Priority 2: Fireworks (Excellent Fallback)
        print("🔍 Initializing Fireworks Provider...")
        try:
            self.providers.append(FireworksProvider())
            print("✅ Fireworks Provider loaded successfully")
        except Exception as e:
            print(f"⚠️ Fireworks Provider skipped: {str(e)}")

        # Priority 3: Local LLM (Responsive, no internet required)
        print("🔍 Initializing Local Provider...")
        try:
            self.providers.append(LocalProvider())
            print("✅ Local Provider loaded successfully")
        except Exception as e:
            print(f"⚠️ Local Provider skipped: {str(e)}")

        # Fallback: Mock Provider (Always works)
        self.providers.append(MockProvider())

        
    async def generate(self, prompt: str) -> str:
        return await FallbackManager.try_providers(self.providers, prompt)
