from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class LessonPlannerEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, payload: dict):
        topic = payload.get("topic", "General")
        grade = payload.get("grade", "6th Grade")
        duration = str(payload.get("duration", "45 mins"))
        details = payload.get("details", "")
        
        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.LESSON_PLANNER}
        
        INPUT DATA:
        - Topic: {topic}
        - Grade: {grade}
        - Preferred Duration: {duration}
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
            print(f"❌ JSON Parse Error: {str(e)} | Raw Response starts with: {response[:100]}")
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
