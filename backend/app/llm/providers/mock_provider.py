from app.llm.providers.base import BaseLLMProvider
import asyncio

import random

class MockProvider(BaseLLMProvider):
    async def generate(self, prompt: str) -> str:
        # Simulate network delay
        await asyncio.sleep(1)
        
        # Responses for when we are in fallback mode
        placeholders = [
            "I understand you're asking about this topic. As Vasu AI, I'd suggest focusing on building conceptual clarity through local examples and interactive activities.",
            "That's an interesting perspective. Indian classrooms often benefit from combining traditional wisdom with modern pedagogical tools like active learning.",
            "I'm currently in a limited response mode, but I can tell you that centering the student's experience in the local context is key to engagement.",
            "Namaste! I'm processing your request. Even in this simplified mode, I advocate for syllabus alignment and cultural relevance in every lesson."
        ]
        
        # Only return keyword-specific content if it's the PRIMARY intent (hacky heuristic)
        # We check if the keyword is near the end of the prompt (where the user's message usually is)
        user_part = prompt.split("CURRENT MESSAGE FROM TEACHER:")[-1].lower() if "CURRENT MESSAGE FROM TEACHER:" in prompt else prompt.lower()
        
        if "lesson plan" in user_part:
            return f"## [Draft] Lesson Plan Suggestion\n\n**Topic Focus:** Focus on the core aspects identified.\n\n### Activities\n- Discussion on local relevance.\n- Group exercise with peer feedback."
        elif "quiz" in user_part:
            return "## [Draft] Quiz Questions\n\n1. Explain the importance of this topic in your daily life?\n2. Give one local example related to this concept."
        elif "story" in user_part:
            return "## [Draft] Story Outline\n\nOnce in a small village in India, a young student discovered that learning isn't just in books, but in the world around them... (This is a simplified response)."
            
        return random.choice(placeholders)

