from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import lesson, quiz, story, user, health, auth, content, library, chat, simulation, visual, tools


app = FastAPI(title=settings.PROJECT_NAME)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"DEBUG: Validation Error at {request.url.path}")
    print(f"DEBUG: Error details: {exc.errors()}")
    print(f"DEBUG: Request body mapping: {exc.body}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )


# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(tools.router, tags=["Tools"], prefix=f"{settings.API_V1_STR}/tools")

@app.get("/")
def root():
    return {"message": "Welcome to Learnivo Backend API"}
