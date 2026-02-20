from pydantic import BaseModel, Field
from typing import Optional, List

class QuizGeneratorRequest(BaseModel):
    topic: str
    grade: str
    difficulty: str
    questionCount: int
    type: str # 'mcq', 'true_false', etc.
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None
