from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class StoryEngine:

    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "Friendship")
        grade = payload.get("grade", "3rd Grade")
        genre = payload.get("genre", "Adventure")
        
        length = payload.get("length", "Short")
        language = payload.get("language", "English")
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
                    You MUST base the story characters, setting, or theme on this material.
                    
                    {rag_content[:20000]}
                    """
            except Exception as e:
                print(f"[RAG ERROR] {e}")

        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.STORY_GENERATOR}
        
        {rag_context}
        
        INPUT DATA:
        - Topic: {topic}
        - Grade: {grade}
        - Genre: {genre}
        - Length: {length}
        - Language: {language}
        
        Please generate the educational story now:
        """
        
        return await self.llm.generate(prompt)
