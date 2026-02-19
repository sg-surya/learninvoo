from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class QuizGeneratorEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "General")
        grade = payload.get("grade", "6th Grade")
        difficulty = payload.get("difficulty", "Medium")
        count = payload.get("questionCount", 5)
        
        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.QUIZ_GENERATOR}
        
        INPUT DATA:
        - Topic: {topic}
        - Grade: {grade}
        - Difficulty: {difficulty}
        - Number of Questions: {count}
        
        Please generate the quiz now:
        """
        
        return await self.llm.generate(prompt)
