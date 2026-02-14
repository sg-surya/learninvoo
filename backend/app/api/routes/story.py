from fastapi import APIRouter, HTTPException
from app.schemas.story import StoryGeneratorRequest
from app.orchestrator.task_router import TaskRouter

router = APIRouter()

@router.post("/generate", response_model=dict)
async def generate_story(
    request: StoryGeneratorRequest
):
    try:
        payload = request.model_dump()
        result = await TaskRouter.route("story", payload)
        
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
