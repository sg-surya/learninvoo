from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.orchestrator.task_router import TaskRouter

router = APIRouter()

@router.post("/send", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a chat message to Vasu AI and get a response.
    """
    try:
        # Prepare payload for task router
        payload = {
            "message": request.message,
            "history": request.history or [], 
            "context": request.context,
            "deeper_research": request.deeper_research
        }
        
        response_text = await TaskRouter.route("chat", payload)
        
        return ChatResponse(response=response_text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

