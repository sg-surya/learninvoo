from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class ChatbotEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def chat(self, message: str, history: list = None, context: dict = None):
        # We can format history here if needed
        history_str = ""
        if history:
            for msg in history:
                role = "User" if msg['role'] == 'user' else "AI"
                history_str += f"{role}: {msg['content']}\n"

        context_str = ""
        if context:
            context_str = f"CURRENT CONTEXT: {context.get('tool', 'General')} feedback for topic '{context.get('topic')}'."
            if context.get('current_lesson'):
                context_str += f"\nTHE LESSON PLAN UNDER DISCUSSION: {context.get('current_lesson')}"

        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.CHATBOT}
        
        {context_str}
        
        CONVERSATION HISTORY:
        {history_str}
        
        CURRENT MESSAGE FROM TEACHER:
        {message}
        
        Vasu AI Response:
        """
        
        return await self.llm.generate(prompt)
