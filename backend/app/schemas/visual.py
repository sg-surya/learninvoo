from pydantic import BaseModel
from typing import List

class VisualRequest(BaseModel):
    topic: str
    grade: str
    visual_style: str
    source_mode: str = "topic"
    book_title: str | None = None
    chapters: List[str] | None = None

class GeneratedVisual(BaseModel):
    id: str
    url: str
    style: str
    prompt: str

class VisualResponse(BaseModel):
    visuals: List[GeneratedVisual]
