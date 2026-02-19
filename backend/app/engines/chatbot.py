from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts
import logging

logger = logging.getLogger(__name__)


class ChatbotEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def chat(self, message: str, history: list = None, context: dict = None):
        # Format conversation history for context
        history_str = ""
        if history and len(history) > 0:
            recent_history = history[-10:]
            for msg in recent_history:
                role = "User" if msg.get('role') == 'user' else "Vasu AI"
                history_str += f"{role}: {msg.get('content', '')}\n"

        context_str = ""
        if context:
            context_str = f"CURRENT CONTEXT: {context.get('tool', 'General')} feedback for topic '{context.get('topic')}'."
            if context.get('current_lesson'):
                context_str += f"\nTHE LESSON PLAN UNDER DISCUSSION: {context.get('current_lesson')}"

        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.CHATBOT}
        
        IMPORTANT INSTRUCTIONS:
        - Answer the user's question directly and specifically
        - If the user asks about a topic (like LLMs, AI, science, etc.), provide detailed, accurate information
        - Use markdown formatting for readability (headers, bold, bullet points, code blocks)
        - Be conversational but informative
        - If the user's message is a greeting, respond warmly
        - Keep responses focused and relevant to what was asked

        {context_str}
        
        CONVERSATION HISTORY:
        {history_str}
        
        CURRENT MESSAGE FROM TEACHER:
        {message}
        
        Vasu AI Response:
        """
        
        logger.info("[CHATBOT] Processing message: %s", message[:80])
        
        try:
            return await self.llm.generate(prompt)
        except Exception as e:
            error_msg = str(e)
            logger.error("[CHATBOT] LLM generation failed: %s", error_msg[:200])
            
            # Return a user-friendly error message
            if "quota" in error_msg.lower() or "rate" in error_msg.lower() or "429" in error_msg:
                return (
                    "## API Quota Exceeded\n\n"
                    "I'm sorry, but the Google Gemini API quota has been exceeded for today. "
                    "This usually resets within 24 hours.\n\n"
                    "### What you can do:\n"
                    "1. **Wait** for the quota to reset (usually resets daily)\n"
                    "2. **Generate a new API key** at [Google AI Studio](https://aistudio.google.com/apikey)\n"
                    "3. **Upgrade** to a paid plan for higher limits\n\n"
                    "I'll be back to full power once the quota resets!"
                )
            
            return (
                "## Connection Issue\n\n"
                "I'm having trouble connecting to the AI service right now. "
                "Please check your internet connection and try again in a moment.\n\n"
                f"**Error:** {error_msg[:150]}"
            )
