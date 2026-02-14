from pydantic import BaseModel
from typing import List, Optional

class ChapterBase(BaseModel):
    title: str
    sequence_number: int
    content: Optional[str] = None

class ChapterCreate(ChapterBase):
    pass

class Chapter(ChapterBase):
    id: int
    book_id: int

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    title: str
    author: str
    grade_level: str
    subject: str
    cover_image: Optional[str] = None

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    chapters: List[Chapter] = []

    class Config:
        from_attributes = True
