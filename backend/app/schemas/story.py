from pydantic import BaseModel, Field
from typing import Optional, List

class StoryGeneratorRequest(BaseModel):
    topic: str
    grade: str
    genre: str
    length: Optional[str] = None
    language: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None
