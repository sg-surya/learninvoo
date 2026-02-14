from app.llm.router import LLMRouter

class LessonEngine:

    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "General Science")
        grade = payload.get("grade", "6th Grade")
        book_id = payload.get("bookId")
        chapter_ids = payload.get("chapterIds")
        
        # In a real scenario, fetch book/chapter content here

        prompt = f"""
        Create a structured lesson plan for grade {grade}
        on topic: {topic}

        Include:
        - Introduction (catchy check-in)
        - Core concept explanation (simple terms)
        - Examples (2-3)
        - Practice questions (short quiz)
        - Conclusion
        """

        return await self.llm.generate(prompt)
