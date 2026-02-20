from pydantic import BaseModel
from typing import List, Optional

class HyperLocalRequest(BaseModel):
    topic: Optional[str] = None
    grade: str
    region: str
    language: str
    custom_nuances: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None

class VocabularyItem(BaseModel):
    term: str
    definition: str

class LandmarkItem(BaseModel):
    name: str # Name of landmark
    distance: str # Distance from center
    description: str # Why relevant
    image_url: Optional[str] = None # Pollinations URL

class ActivityItem(BaseModel):
    title: str
    description: str

class CaseStudy(BaseModel):
    title: str
    intro: str
    prompt: str
    watershed_text: str # Renaming to 'context_text' generally? No keep specific for now or make generic
    conservation_tips: List[str]

class HyperLocalContent(BaseModel):
    title: str
    subtitle: str
    vocabulary: List[VocabularyItem]
    landmarks: List[LandmarkItem]
    case_study: CaseStudy
    activities: List[ActivityItem]
    links: List[str]
