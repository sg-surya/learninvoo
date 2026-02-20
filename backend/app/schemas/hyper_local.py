from pydantic import BaseModel
from typing import List, Optional

class HyperLocalRequest(BaseModel):
    topic: str
    grade: str
    region: str
    language: str
    custom_nuances: Optional[str] = None

class VocabularyItem(BaseModel):
    term: str
    definition: str

class LandmarkItem(BaseModel):
    name: str
    distance: str
    description: str

class ActivityItem(BaseModel):
    title: str
    description: str

class CaseStudy(BaseModel):
    title: str
    intro: str
    prompt: str
    watershed_text: str
    conservation_tips: List[str]

class HyperLocalContent(BaseModel):
    title: str
    subtitle: str
    vocabulary: List[VocabularyItem]
    landmarks: List[LandmarkItem]
    case_study: CaseStudy
    activities: List[ActivityItem]
    links: List[str]
