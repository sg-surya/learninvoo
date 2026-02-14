from sqlalchemy.ext.asyncio import AsyncSession
from app.db import models

async def create_mock_books(db: AsyncSession):
    books = [
        models.Book(
            title="Science Explorer: Grade 6",
            author="Prentice Hall",
            grade_level="Grade 6",
            subject="Science",
        ),
        models.Book(
            title="Mathematics: The Easy Way",
            author="Barron's",
            grade_level="Grade 8",
            subject="Math",
        ),
         models.Book(
            title="World History: Medieval to Early Modern Times",
            author="Holt",
            grade_level="Grade 7",
            subject="History",
        ),
    ]
    for book in books:
        db.add(book)
    await db.commit()
    print("Mock books created.")
