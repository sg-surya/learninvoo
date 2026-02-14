from app.llm.router import LLMRouter

class QuizEngine:

    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "General Science")
        grade = payload.get("grade", "6th Grade")
        question_count = payload.get("questionCount", 5)
        difficulty = payload.get("difficulty", "Medium")

        prompt = f"""
        Create a {question_count}-question quiz for grade {grade}
        on topic: {topic}
        Difficulty: {difficulty}

        Format as JSON if possible, with keys: question, options (array), answer, explanation.
        """

        return await self.llm.generate(prompt)
