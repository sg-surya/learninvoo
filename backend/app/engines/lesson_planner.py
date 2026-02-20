from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class LessonPlannerEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "General")
        grade = payload.get("grade", "6th Grade")
        duration = str(payload.get("duration", "45")) + " mins"
        days = payload.get("days", "1")
        language = payload.get("language", "English")
        fmt = payload.get("format", "Standard")
        details = payload.get("details", "")
        book_id = payload.get("bookId")
        chapter_ids = payload.get("chapterIds")

        # RAG Context Retrieval
        rag_context = ""
        if book_id or chapter_ids:
            try:
                from app.services.rag_service import RAGService
                rag_content = await RAGService.get_context(book_id, chapter_ids)
                if rag_content:
                    rag_context = f"""
                    ## SOURCE MATERIAL (CRITICAL CONTEXT):
                    The following content is from the teacher's selected book/chapters.
                    You MUST base your lesson plan primarily on this material.
                    Do not invent facts outside this source unless necessary for context.
                    
                    {rag_content[:20000]}  # Limiting context for safety
                    """
                    print(f"[RAG] Injected context length: {len(rag_content)}")
            except Exception as e:
                print(f"[RAG ERROR] Failed to fetch context: {e}")
        
        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.LESSON_PLANNER}
        
        {rag_context}
        
        INPUT DATA:
        - Topic: {topic}
        - Grade: {grade}
        - Duration per session: {duration}
        - Number of Days: {days}
        - Target Language: {language} (CRITICAL: Output MUST be in this language)
        - Format: {fmt}
        - Specific Instructions: {details}
        
        Please generate the JSON now:
        """
        
        response = await self.llm.generate(prompt)
        
        # Try to parse or extract JSON
        import json
        import re
        
        # Helper to clean response
        def clean_json(text):
            # Remove markdown backticks if present
            text = re.sub(r'```json\s*', '', text)
            text = re.sub(r'```\s*', '', text)
            # Find the first { and last }
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                return text[start:end+1]
            return text

        try:
            cleaned_response = clean_json(response)
            return json.loads(cleaned_response)
        except Exception as e:
            # Fallback if AI fails completely - Make it VERY relevant
            import logging
            logging.getLogger(__name__).error("[LESSON] JSON Parse Error: %s | Raw: %s", str(e), response[:100])
            return {
                "title": f"Mastery in {topic}",
                "subtitle": f"A comprehensive lesson for {grade}",
                "overview": f"This lesson explores {topic} through the lens of modern pedagogy and practical application. We connect these concepts to everyday experiences to ensure deep student engagement.",
                "objectives": [
                    f"Understand the fundamental principles of {topic}.",
                    f"Apply {topic} concepts to real-world Indian scenarios.",
                    f"Evaluate the impact of {topic} on society and technology."
                ],
                "duration": duration,
                "materials": [
                    {"name": "NCERT/Textbook", "icon": "book", "color": "blue"},
                    {"name": "Visual Aids/Charts", "icon": "image", "color": "lime"},
                    {"name": "Interactive Quiz Sheet", "icon": "clipboard", "color": "purple"}
                ],
                "activities": [
                    {"title": "The 'Hook' - Engagement", "duration": "10 Mins", "description": f"Start with a question: 'How does {topic} affect our daily life in India?' Discuss student observations."},
                    {"title": "Conceptual Deep-Dive", "duration": "20 Mins", "description": f"Explain the core mechanics of {topic}. Use an analogy related to Indian railways or local markets."},
                    {"title": "Hands-on Activity", "duration": "15 Mins", "description": f"Group task: Students draw or model a real-life application of {topic}."}
                ],
                "assessment": [
                    f"What is the most important application of {topic}?",
                    "How would you explain this to a younger student?"
                ],
                "homework": f"Find an example of {topic} in your neighborhood tonight and write a 5-line observation.",
                "tips": ["Keep the session interactive and encourage doubts.", "Relate theory to local landmarks or news."]
            }
