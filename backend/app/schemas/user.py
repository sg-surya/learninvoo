from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: int
    hashed_password: str
    
    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True
