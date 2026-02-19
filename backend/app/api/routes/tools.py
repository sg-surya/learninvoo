from fastapi import APIRouter, HTTPException
from app.orchestrator.task_router import TaskRouter
from pydantic import BaseModel

router = APIRouter()

class ToolRequest(BaseModel):
    # Flexible model for any tool data
    payload: dict = {}

@router.post("/{tool_id}/generate", response_model=dict)
async def generate_tool_content(tool_id: str, request: dict):
    try:
        # tool_id will be things like hyper_local_content, rubric_generator etc.
        result = await TaskRouter.route(tool_id, request)
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
