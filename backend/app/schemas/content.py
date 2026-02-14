from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class ContentBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str # lesson-plan, quiz, story
    content_data: str # JSON string or text
    content_type: str = "text" # text, image, json
    tool_id: str
    book_id: Optional[int] = None
    chapter_id: Optional[int] = None

class ContentCreate(ContentBase):
    pass

class ContentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_data: Optional[str] = None

class Content(ContentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
