from typing import List, Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Core Data Models (Existing) ---

class PerformanceData(BaseModel):
    month: str
    value: float

class ClassInfo(BaseModel):
    id: str
    name: str
    studentsCount: int
    grade: str
    startDate: str

class Student(BaseModel):
    id: str
    firstName: str
    lastName: str
    age: int
    interests: List[str]
    score: int
    grade: str

class TopStudent(BaseModel):
    id: str
    name: str
    score: int
    avatar: str

# --- Mock Data (Existing) ---

PERFORMANCE_DATA = [
    {"month": 'JAN', "value": 30},
    {"month": 'FEB', "value": 45},
    {"month": 'MAR', "value": 60},
    {"month": 'APR', "value": 50},
    {"month": 'MAY', "value": 70},
    {"month": 'JUN', "value": 85},
]

CLASSES_DATA = [
    {"id": '1', "name": 'Mathematics', "studentsCount": 30, "grade": 'A', "startDate": '12 Sep 2023'},
    {"id": '2', "name": 'Physics', "studentsCount": 25, "grade": 'B', "startDate": '14 Sep 2023'},
    {"id": '3', "name": 'History', "studentsCount": 28, "grade": 'A', "startDate": '10 Sep 2023'},
    {"id": '4', "name": 'Biology', "studentsCount": 32, "grade": 'B', "startDate": '15 Sep 2023'},
]

STUDENTS_DATA = [
    {"id": '1', "firstName": 'Alice', "lastName": 'Johnson', "age": 14, "interests": ['Math', 'Physics'], "score": 95, "grade": 'A'},
    {"id": '2', "firstName": 'Bob', "lastName": 'Smith', "age": 15, "interests": ['History', 'Art'], "score": 88, "grade": 'B'},
    {"id": '3', "firstName": 'Charlie', "lastName": 'Brown', "age": 14, "interests": ['Biology', 'Sports'], "score": 92, "grade": 'A'},
    {"id": '4', "firstName": 'Diana', "lastName": 'Prince', "age": 15, "interests": ['Math', 'Chemistry'], "score": 98, "grade": 'A'},
    {"id": '5', "firstName": 'Evan', "lastName": 'Wright', "age": 14, "interests": ['Physics', 'Coding'], "score": 85, "grade": 'B'},
]

TOP_STUDENTS_DATA = [
    {"id": '1', "name": 'Alice Johnson', "score": 95, "avatar": 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'},
    {"id": '3', "name": 'Charlie Brown', "score": 92, "avatar": 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'},
    {"id": '4', "name": 'Diana Prince', "score": 98, "avatar": 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana'},
]


# --- Tool Data Models ---

# 1. Lesson Planner
class LessonPlanRequest(BaseModel):
    topic: str
    grade: str
    duration: int
    details: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None

class LessonSection(BaseModel):
    title: str
    duration: str
    content: str
    activity: str

class LessonPlanResponse(BaseModel):
    title: str
    duration: int
    subject: str
    grade: str
    topic: str
    sections: List[LessonSection]

# 2. Visual Generator
class VisualGeneratorRequest(BaseModel):
    sourceMode: str
    topic: Optional[str] = None
    bookId: Optional[str] = None
    chapterIds: Optional[List[str]] = None
    grade: Optional[str] = None
    style: Optional[str] = None

class GeneratedVisual(BaseModel):
    id: str
    url: str
    style: str

# 3. Hyper Local Content
class HyperLocalRequest(BaseModel):
    topic: str
    grade: str
    location: str
    language: str
    culturalContext: Optional[str] = None

class LocalizedContentItem(BaseModel):
    type: str  # 'analogy' | 'activity' | 'example'
    title: str
    content: str

class CurriculumMappingItem(BaseModel):
    standard: str
    description: str

class HyperLocalResponse(BaseModel):
    region: str
    culturalContext: str
    content: List[LocalizedContentItem]
    curriculumMapping: List[CurriculumMappingItem]

# 4. Story Generator
class StoryGeneratorRequest(BaseModel):
    topic: str
    grade: str
    genre: str
    length: Optional[str] = None
    language: Optional[str] = None

class StoryChapter(BaseModel):
    title: str
    content: str

class StoryResponse(BaseModel):
    title: str
    tone: str
    moral: Optional[str] = None
    chapters: List[StoryChapter]

# 5. Quiz Generator
class QuizGeneratorRequest(BaseModel):
    topic: str
    grade: str
    difficulty: str
    questionCount: int
    type: str

class QuizQuestion(BaseModel):
    id: str
    text: str
    options: Optional[List[str]] = None
    answer: str
    explanation: Optional[str] = None

class QuizResponse(BaseModel):
    title: str
    subject: str
    grade: str
    questions: List[QuizQuestion]

# 6. Rubric Generator
class RubricGeneratorRequest(BaseModel):
    topic: str
    grade: str
    scale: str

class RubricLevel(BaseModel):
    label: str
    points: int

class RubricCriterion(BaseModel):
    id: str
    category: str
    descriptions: List[str]

class RubricResponse(BaseModel):
    id: str
    title: str
    levels: List[RubricLevel]
    criteria: List[RubricCriterion]

# 7. Simulation Generator
class SimulationGeneratorRequest(BaseModel):
    topic: str
    grade: str
    complexity: str

class SimulationParam(BaseModel):
    id: str
    label: str
    min: float
    max: float
    step: float
    unit: str
    defaultValue: float

class SimulationResponse(BaseModel):
    id: str
    title: str
    topic: str
    logic: str
    parameters: List[SimulationParam]
    visualData: List[dict] = []

# 8. Paper Digitizer
class PaperDigitizerResponse(BaseModel):
    id: str
    originalImage: str
    digitizedText: str
    wordCount: int
    format: str


# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to Leaninvoo Backend API"}

@app.get("/api/performance", response_model=List[PerformanceData])
def get_performance_data():
    return PERFORMANCE_DATA

@app.get("/api/classes", response_model=List[ClassInfo])
def get_classes_data():
    return CLASSES_DATA

@app.get("/api/students", response_model=List[Student])
def get_students_data():
    return STUDENTS_DATA

@app.get("/api/students/top", response_model=List[TopStudent])
def get_top_students():
    return TOP_STUDENTS_DATA

# --- Tool Endpoints ---

@app.post("/api/tools/lesson-planner", response_model=LessonPlanResponse)
def generate_lesson_plan(request: LessonPlanRequest):
    return {
        "title": f"Lesson on {request.topic}",
        "duration": request.duration,
        "subject": "General Science",
        "grade": request.grade,
        "topic": request.topic,
        "sections": [
            {
                "title": "Introduction",
                "duration": "10 mins",
                "content": f"Introduction to {request.topic} concepts...",
                "activity": "Class discussion"
            },
            {
                "title": "Core Concept",
                "duration": "20 mins",
                "content": "Deep dive into the main principles...",
                "activity": "Group work"
            },
            {
                "title": "Assessment",
                "duration": "15 mins",
                "content": "Review and quiz...",
                "activity": "Quick quiz"
            }
        ]
    }

@app.post("/api/tools/visual-generator", response_model=List[GeneratedVisual])
def generate_visuals(request: VisualGeneratorRequest):
    return [
        {"id": "1", "url": "https://picsum.photos/seed/visual1/800/600", "style": "Colorful"},
        {"id": "2", "url": "https://picsum.photos/seed/visual2/800/600", "style": "Minimal"},
        {"id": "3", "url": "https://picsum.photos/seed/visual3/800/600", "style": "Hand-drawn"},
        {"id": "4", "url": "https://picsum.photos/seed/visual4/800/600", "style": "3D"},
    ]

@app.post("/api/tools/hyper-local", response_model=HyperLocalResponse)
def generate_hyper_local_content(request: HyperLocalRequest):
    return {
        "region": request.location,
        "culturalContext": request.culturalContext or "Local traditions and festivals",
        "content": [
            {
                "type": "analogy",
                "title": "Festival Connection",
                "content": f"Explaining {request.topic} using examples from local festivals in {request.location}."
            },
            {
                "type": "activity",
                "title": "Community Project",
                "content": "Students interview local elders about the topic."
            }
        ],
        "curriculumMapping": [
            {"standard": "CBSE-Sci-01", "description": "Relates to daily life examples."}
        ]
    }

@app.post("/api/tools/story-generator", response_model=StoryResponse)
def generate_story(request: StoryGeneratorRequest):
    return {
        "title": f"The {request.topic} Adventure",
        "tone": request.genre,
        "moral": "Wisdom is found within curiosity.",
        "chapters": [
            {
                "title": "The Beginning",
                "content": f"Once upon a time, in a world where {request.topic} was the key to everything..."
            },
            {
                "title": "The Challenge",
                "content": "Our hero faced a difficult problem that only knowledge could solve..."
            },
            {
                "title": "The Resolution",
                "content": "Through perseverance and learning, the day was saved."
            }
        ]
    }

@app.post("/api/tools/quiz-generator", response_model=QuizResponse)
def generate_quiz(request: QuizGeneratorRequest):
    return {
        "title": f"{request.topic} Quiz",
        "subject": "General Knowledge",
        "grade": request.grade,
        "questions": [
            {
                "id": "1",
                "text": f"What is the primary characteristic of {request.topic}?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A",
                "explanation": "Option A is correct because..."
            },
            {
                "id": "2",
                "text": f"True or False: {request.topic} is essential for life.",
                "answer": "True",
                "explanation": "It is fundamental due to..."
            },
            {
                "id": "3",
                "text": "Which of the following is NOT related?",
                "options": ["Related Item 1", "Related Item 2", "Unrelated Item", "Related Item 3"],
                "answer": "Unrelated Item",
                "explanation": "This item belongs to a different category."
            }
        ]
    }

@app.post("/api/tools/rubric-generator", response_model=RubricResponse)
def generate_rubric(request: RubricGeneratorRequest):
    return {
        "id": str(uuid.uuid4()),
        "title": f"{request.topic} Rubric",
        "levels": [
            {"label": "Exemplary", "points": 4},
            {"label": "Proficient", "points": 3},
            {"label": "Developing", "points": 2},
            {"label": "Beginning", "points": 1}
        ],
        "criteria": [
            {
                "id": "1",
                "category": "Content Knowledge",
                "descriptions": [
                    "Exceptional understanding shown.",
                    "Good understanding shown.",
                    "Basic understanding shown.",
                    "Minimal understanding shown."
                ]
            },
            {
                "id": "2",
                "category": "Organization",
                "descriptions": [
                    "Highly organized and logical.",
                    "Organized and mostly logical.",
                    "Somewhat organized.",
                    "Disorganized."
                ]
            }
        ]
    }

@app.post("/api/tools/simulation-generator", response_model=SimulationResponse)
def generate_simulation(request: SimulationGeneratorRequest):
    return {
        "id": str(uuid.uuid4()),
        "title": f"{request.topic} Simulation",
        "topic": request.topic,
        "logic": "Physics Engine v1.0",
        "parameters": [
            {"id": "v", "label": "Variable 1", "min": 0, "max": 100, "step": 1, "unit": "units", "defaultValue": 50},
            {"id": "t", "label": "Time", "min": 0, "max": 60, "step": 1, "unit": "s", "defaultValue": 30}
        ],
        "visualData": []
    }

@app.post("/api/tools/paper-digitizer", response_model=PaperDigitizerResponse)
async def digitize_paper(file: UploadFile = File(...)):
    # In a real app, process the file here.
    # For now, return mock data.
    return {
        "id": str(uuid.uuid4()),
        "originalImage": "https://picsum.photos/seed/paper/800/1000", # Mock image URL
        "digitizedText": "## Digitized Content\\n\\nThis is the content extracted from the uploaded file.\\n\\n### Key Points:\\n- Point 1\\n- Point 2\\n\\nScan complete with high accuracy.",
        "wordCount": 150,
        "format": "Markdown"
    }
