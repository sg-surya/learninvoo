from app.llm.router import LLMRouter

class StoryEngine:

    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic")
        grade = payload.get("grade")
        genre = payload.get("genre", "Adventure")
        
        prompt = f"""
        Write a short story about {topic} for grade {grade} students.
        Genre: {genre}.
        Include 3 chapters.
        Make it engaging and educational.
        """
        
        return await self.llm.generate(prompt)
