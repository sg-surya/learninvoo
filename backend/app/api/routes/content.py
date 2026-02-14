from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db import models
from app.schemas import content as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Content])
async def read_contents(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve contents.
    """
    result = await db.execute(
        select(models.Content)
        .filter(models.Content.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    contents = result.scalars().all()
    return contents

@router.post("/", response_model=schemas.Content)
async def create_content(
    *,
    db: AsyncSession = Depends(deps.get_db),
    content_in: schemas.ContentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new content.
    """
    content = models.Content(
        **content_in.model_dump(),
        user_id=current_user.id
    )
    db.add(content)
    await db.commit()
    await db.refresh(content)
    return content

@router.get("/{id}", response_model=schemas.Content)
async def read_content(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get content by ID.
    """
    result = await db.execute(select(models.Content).filter(models.Content.id == id, models.Content.user_id == current_user.id))
    content = result.scalars().first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@router.delete("/{id}", response_model=schemas.Content)
async def delete_content(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete content.
    """
    result = await db.execute(select(models.Content).filter(models.Content.id == id, models.Content.user_id == current_user.id))
    content = result.scalars().first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    await db.delete(content)
    await db.commit()
    return content
