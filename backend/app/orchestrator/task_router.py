from app.engines.lesson_planner import LessonPlannerEngine
from app.engines.quiz_generator import QuizGeneratorEngine
from app.engines.story_engine import StoryEngine
from app.engines.chatbot import ChatbotEngine
from app.engines.generic_engine import GenericEngine
import asyncio

class TaskRouter:

    @staticmethod
    async def route(task_type: str, payload: dict):
        if task_type == "lesson":
            return await LessonPlannerEngine().generate(payload)
        elif task_type == "quiz":
            return await QuizGeneratorEngine().generate(payload)
        elif task_type == "story":
            return await StoryEngine().generate(payload)
        elif task_type == "chat":
            return await ChatbotEngine().chat(payload.get("message"), payload.get("history"), payload.get("context"))
        else:
            # Handle all other tools via GenericEngine
            return await GenericEngine().generate(task_type, payload)
