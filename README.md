# Learnivo - AI-Powered Education Platform

Learnivo is a cutting-edge platform designed to revolutionize education through AI. It provides tools for teachers and students to create, visualize, and interact with educational content in unprecedented ways.

## Features

-   **Lesson Planning**: Generate structured lesson plans instantly.
-   **Quiz Generation**: Create quizzes from any content.
-   **Visual Generation**: Generate images and simulations to explain concepts.
-   **Story Generation**: Turn educational topics into engaging narratives.
-   **Interactive Chat**: Conversational AI for tutoring and assistance.
-   **Library Management**: Organize and access your generated content.

## Project Structure

This repository is organized as follows:

-   `backend/`: A FastAPI application providing the core logic, AI integrations, and database interactions.
-   `frontend/`: A Next.js application providing the modern, responsive user interface.

## Getting Started

### Prerequisites

-   **Python 3.10+**
-   **Node.js 18+**
-   **PostgreSQL** (or SQLite for development if configured)

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

-   **Windows**: `venv\Scripts\activate`
-   **macOS/Linux**: `source venv/bin/activate`

Install dependencies:

```bash
pip install -r requirements.txt
```

Set up environment variables:

Copy `.env.example` to `.env` and fill in your API keys (OpenAI, Fireworks AI, etc.) and database credentials.

```bash
cp .env.example .env
```

Run database migrations (if applicable):

```bash
alembic upgrade head
```

Start the server:

```bash
# Using Python directly
python main.py

# OR using Uvicorn directly
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`. The API documentation can be found at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

Create a `.env.local` file if necessary, pointing to your backend API (default is usually `http://localhost:8000`).

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

The project is designed for rapid iteration. The backend uses `uvicorn` with hot reload, and the frontend uses Next.js with Fast Refresh.

## License

[MIT](https://choosealicense.com/licenses/mit/)
