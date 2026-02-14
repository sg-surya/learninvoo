from app.engines.lesson_engine import LessonEngine
from app.engines.quiz_engine import QuizEngine
from app.engines.story_engine import StoryEngine
import asyncio

class TaskRouter:

    @staticmethod
    async def route(task_type: str, payload: dict):
        if task_type == "lesson":
            return await LessonEngine().generate(payload)
        elif task_type == "quiz":
            return await QuizEngine().generate(payload)
        elif task_type == "story":
            return await StoryEngine().generate(payload)
        else:
            raise ValueError(f"Unknown task type: {task_type}")
