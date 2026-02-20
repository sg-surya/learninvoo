from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

# --- Supporting Schemas ---
class StudentProfile(BaseModel):
    admission_number: Optional[str] = None
    batch_id: Optional[int] = None
    attendance_percentage: Optional[float] = None
    fee_balance: Optional[float] = None
    
    class Config:
        from_attributes = True

class EmployeeProfile(BaseModel):
    employee_id: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    
    class Config:
        from_attributes = True

class BatchBase(BaseModel):
    name: str
    grade_level: str
    academic_year: str

class Batch(BatchBase):
    id: int
    class_teacher_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "student"
    school: Optional[str] = None # Added for frontend compatibility

class UserCreate(UserBase):
    password: str
    # Optional extensions during signup
    admission_number: Optional[str] = None
    employee_id: Optional[str] = None

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
    student_profile: Optional[StudentProfile] = None
    employee_profile: Optional[EmployeeProfile] = None
    
    class Config:
        from_attributes = True
