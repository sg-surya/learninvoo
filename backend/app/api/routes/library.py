from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.db import models
from app.schemas import library as schemas

router = APIRouter()

@router.get("/books", response_model=List[schemas.Book])
async def read_books(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve books with chapters.
    """
    stmt = select(models.Book).options(selectinload(models.Book.chapters)).offset(skip).limit(limit)
    result = await db.execute(stmt)
    books = result.scalars().all()
    return books

@router.post("/books", response_model=schemas.Book)
async def create_book(
    *,
    db: AsyncSession = Depends(deps.get_db),
    book_in: schemas.BookCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new book.
    """
    book = models.Book(**book_in.model_dump())
    db.add(book)
    await db.commit()
    await db.refresh(book)
    # Re-fetch to load chapters (empty initially but consistent return)
    stmt = select(models.Book).options(selectinload(models.Book.chapters)).where(models.Book.id == book.id)
    result = await db.execute(stmt)
    book = result.scalars().first()
    return book

@router.get("/books/{id}", response_model=schemas.Book)
async def read_book(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get book by ID.
    """
    stmt = select(models.Book).options(selectinload(models.Book.chapters)).filter(models.Book.id == id)
    result = await db.execute(stmt)
    book = result.scalars().first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/books/{book_id}/chapters", response_model=List[schemas.Chapter])
async def read_chapters(
    *,
    db: AsyncSession = Depends(deps.get_db),
    book_id: int,
) -> Any:
    """
    Get chapters for a book.
    """
    result = await db.execute(select(models.Chapter).filter(models.Chapter.book_id == book_id))
    chapters = result.scalars().all()
    return chapters
