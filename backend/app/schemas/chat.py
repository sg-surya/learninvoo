from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    history: list = None
    context: dict = None
    deeper_research: bool = False

class ChatResponse(BaseModel):
    response: str
