from pydantic import BaseModel, Field
from typing import Optional, List

class LessonPlanRequest(BaseModel):
    topic: str
    grade: str
    duration: int = 45
    days: Optional[str] = None
    language: Optional[str] = None
    format: Optional[str] = None
    details: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None
