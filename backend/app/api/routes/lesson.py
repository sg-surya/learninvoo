from fastapi import APIRouter, HTTPException
from app.schemas.lesson import LessonPlanRequest
from app.orchestrator.task_router import TaskRouter

router = APIRouter()

@router.post("/generate", response_model=dict)
async def generate_lesson(
    request: LessonPlanRequest
):
    try:
        payload = request.model_dump()
        result = await TaskRouter.route("lesson", payload)
        
        # We could save this to history using current_user.id
        
        return {"content": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
