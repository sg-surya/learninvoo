from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts
import json
import re
import urllib.parse
import random

class HyperLocalEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "Local Environment")
        grade = payload.get("grade", "Grade 6")
        region = payload.get("region", "Mumbai, India")
        language = payload.get("language", "English")
        nuances = payload.get("custom_nuances", "")
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
                    You MUST relate the local examples ({region}) specifically to the concepts explained in this text.
                    For example, if the text is about 'Rainwater Harvesting', find local examples of that.
                    
                    {rag_content[:20000]}
                    """
            except Exception as e:
                print(f"[RAG ERROR] {e}")

        # Construct specific prompt for Hyper Local content
        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        
        {rag_context}
        
        ## TASK: Generate Hyper-Local Educational Content
        You are an expert local guide and educator.
        Create deeply contextualized content for students in: {region}.
        Topic: {topic}
        Grade: {grade}
        Language Context: {language} (Use local terms with translations)
        Specific Local Nuances: {nuances}
        
        ## REQUIREMENTS:
        1. **Vocabulary**: 3 local terms related to the topic/source material.
        2. **Landmarks**: 2 real, specific landmarks near {region} relevant to the topic.
        3. **Case Study**: A short, engaging story/narrative set in {region}.
        4. **Activities**: 2 cultural connection activities.
        5. **Typos/Grammar**: Ensure PERFECT spelling and grammar. Use Title Case for headers.
        
        ## OUTPUT FORMAT:
        Return ONLY valid JSON matching this structure:
        {{
            "title": "Title (e.g. {topic} in {region})",
            "subtitle": "Grade Level • {language} Context • {region}",
            "vocabulary": [
                {{"term": "Local Term (Script if applicable)", "definition": "English definition and usage context"}}
            ],
            "landmarks": [
                {{"name": "Specific Landmark Name", "distance": "Approx distance", "description": "Why it matters"}}
            ],
            "case_study": {{
                "title": "Engaging Story Title",
                "intro": "Hook paragraph setting the scene in {region}...",
                "prompt": "Interactive question for students...",
                "watershed_text": "Educational explanation connecting local geography to topic...",
                "conservation_tips": ["Tip 1", "Tip 2", "Tip 3"]
            }},
            "activities": [
                {{"title": "Activity Name", "description": "Instructions..."}}
            ],
            "links": ["Local Org 1", "Gov Dept Name", "NGO Name", "Community Group"]
        }}
        """
        
        response = await self.llm.generate(prompt)
        
        # Parse JSON
        try:
            # Clean generic markdown
            text = re.sub(r'```json\s*', '', response)
            text = re.sub(r'```\s*', '', text)
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                json_str = text[start:end+1]
                data = json.loads(json_str)
                
                # Enhance with images for landmarks
                for landmark in data.get("landmarks", []):
                    query = f"{landmark['name']} {region} {topic}"
                    encoded = urllib.parse.quote(query)
                    # Use Pollinations for landmark images
                    seed = random.randint(0, 1000)
                    landmark["image_url"] = f"https://image.pollinations.ai/prompt/{encoded}?width=400&height=400&seed={seed}&nologo=true"
                
                return data
            else:
                raise ValueError("No JSON found")
                
        except Exception as e:
            print(f"[HYPERLOCAL] Error parsing: {e}")
            # Fallback structure but with valid data from prompt if possible
            return {
                "title": f"{topic} in {region}",
                "subtitle": f"{grade} • {language} • {region}",
                "vocabulary": [{"term": "Local Term", "definition": "Definition"}],
                "landmarks": [],
                "case_study": {
                    "title": "Local Exploration",
                    "intro": "Explore your surroundings...",
                    "prompt": "Look around you...",
                    "watershed_text": "Understanding local context...",
                    "conservation_tips": ["Observe", "Document", "Share"]
                },
                "activities": [],
                "links": []
            }
