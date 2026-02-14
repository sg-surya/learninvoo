from fastapi import APIRouter, Depends
from typing import List
from app.api import deps
from app.schemas.user import User
from app.db import models

router = APIRouter()

@router.get("/me", response_model=User)
def read_current_user(
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get current logged in user.
    """
    return current_user
