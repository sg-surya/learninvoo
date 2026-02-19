from app.llm.router import LLMRouter
from app.core.prompts import AIPrompts

class GenericEngine:
    def __init__(self):
        self.llm = LLMRouter()

    async def generate(self, tool_type: str, payload: dict):
        prompt = f"""
        {AIPrompts.SYSTEM_COMMON}
        {AIPrompts.GENERIC_TOOL}
        
        TOOL REQUESTED: {tool_type}
        USER DATA: {payload}
        
        Please generate the high-quality content now:
        """
        
        return await self.llm.generate(prompt)
