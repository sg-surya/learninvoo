from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import lesson, quiz, story, user, health, auth, content, library, chat, simulation, visual

app = FastAPI(title=settings.PROJECT_NAME)

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex="https?://.*", # Allow all origins for development to fix CORS issues
)

# Include Routers
app.include_router(health.router, tags=["Health"], prefix="/health")
app.include_router(auth.router, tags=["Auth"], prefix=f"{settings.API_V1_STR}/auth")
app.include_router(lesson.router, tags=["Lesson"], prefix=f"{settings.API_V1_STR}/lesson")
app.include_router(quiz.router, tags=["Quiz"], prefix=f"{settings.API_V1_STR}/quiz")
app.include_router(story.router, tags=["Story"], prefix=f"{settings.API_V1_STR}/story")
app.include_router(user.router, tags=["User"], prefix=f"{settings.API_V1_STR}/user")
app.include_router(content.router, tags=["Content"], prefix=f"{settings.API_V1_STR}/content")
app.include_router(library.router, tags=["Library"], prefix=f"{settings.API_V1_STR}/library")
app.include_router(chat.router, tags=["Chat"], prefix=f"{settings.API_V1_STR}/chat")
app.include_router(simulation.router, tags=["Simulation"], prefix=f"{settings.API_V1_STR}/simulation")
app.include_router(visual.router, tags=["Visual"], prefix=f"{settings.API_V1_STR}/visual")

@app.get("/")
def root():
    return {"message": "Welcome to Learnivo Backend API"}
