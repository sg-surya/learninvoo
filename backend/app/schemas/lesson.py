from pydantic import BaseModel, Field
from typing import Optional, List

class LessonPlanRequest(BaseModel):
    topic: str
    grade: str
    duration: int
    details: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None
