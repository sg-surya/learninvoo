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
        
        book_id = payload.get("bookId")
        chapter_ids = payload.get("chapterIds")
        
        rag_context = ""
        if book_id or chapter_ids:
            try:
                from app.services.rag_service import RAGService
                rag_content = await RAGService.get_context(book_id, chapter_ids)
                if rag_content:
                    rag_context = f"""
                    ## SOURCE MATERIAL (CRITICAL CONTEXT):
                    The following content is from the teacher's selected book/chapters.
                    You MUST generate quiz questions based specifically on this material.
                    
                    {rag_content[:20000]}
                    """
            except Exception as e:
                print(f"[RAG ERROR] {e}")

        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.QUIZ_GENERATOR}
        
        {rag_context}
        
        INPUT DATA:
        - Topic: {topic}
        - Grade: {grade}
        - Difficulty: {difficulty}
        - Number of Questions: {count}
        
        Please generate the quiz now:
        """
        
        return await self.llm.generate(prompt)
