from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.llm.router import LLMRouter

router = APIRouter()

@router.post("/send", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a chat message to Vasu AI and get a response.
    """
    try:
        llm = LLMRouter()
        
        # Build the prompt based on whether deeper research is enabled
        if request.deeper_research:
            prompt = f"""You are Vasu AI, an intelligent educational assistant. 
The user has requested deeper research on the following topic.
Provide a comprehensive, well-researched response with multiple perspectives and detailed information.

User's question: {request.message}

Provide a thorough response with facts, examples, and insights."""
        else:
            prompt = f"""You are Vasu AI, a friendly and intelligent educational assistant.
Provide a helpful, concise, and accurate response to the user's question.

User: {request.message}"""
        
        # Generate response using LLM
        response = await llm.generate(prompt)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

