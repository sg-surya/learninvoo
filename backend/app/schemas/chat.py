from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    deeper_research: bool = False

class ChatResponse(BaseModel):
    response: str
