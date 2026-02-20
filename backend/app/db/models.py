from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, BigInteger, Date, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum

# --- Enums ---
class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class FeeStatus(str, enum.Enum):
    PAID = "paid"
    PENDING = "pending"
    OVERDUE = "overdue"
    PARTIAL = "partial"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    conversations = relationship("Conversation", back_populates="user")
    contents = relationship("Content", back_populates="user")
    
    # IOS Extensions
    student_profile = relationship("Student", back_populates="user", uselist=False)
    employee_profile = relationship("Employee", back_populates="user", uselist=False)

# --- Institute Core ---
class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g. "Class 10-A"
    grade_level = Column(String) # "10"
    academic_year = Column(String) # "2025-2026"
    class_teacher_id = Column(Integer, ForeignKey("employees.id"), nullable=True)

    students = relationship("Student", back_populates="batch")
    attendance_records = relationship("Attendance", back_populates="batch")
    class_teacher = relationship("Employee", back_populates="batches_managed")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    admission_number = Column(String, unique=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    
    # Demographics
    dob = Column(Date)
    parent_contact = Column(String)
    address = Column(Text)
    
    # Stats (denormalized for AI speed)
    attendance_percentage = Column(Float, default=0.0)
    fee_balance = Column(Float, default=0.0)
    dropout_risk_score = Column(Float, default=0.0) # 0 to 1

    user = relationship("User", back_populates="student_profile")
    batch = relationship("Batch", back_populates="students")
    attendance = relationship("Attendance", back_populates="student")
    fees = relationship("FeeTransaction", back_populates="student")
    marks = relationship("ExamMark", back_populates="student")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    employee_id = Column(String, unique=True)
    designation = Column(String) # Teacher, Accountant, Principal
    department = Column(String)
    joining_date = Column(Date)

    user = relationship("User", back_populates="employee_profile")
    batches_managed = relationship("Batch", back_populates="class_teacher")

# --- Operations Modules ---

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(BigInteger, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    batch_id = Column(Integer, ForeignKey("batches.id"))
    date = Column(Date, index=True)
    status = Column(String, default="present") # present, absent, late
    remarks = Column(String, nullable=True)

    student = relationship("Student", back_populates="attendance")
    batch = relationship("Batch", back_populates="attendance_records")

class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. "Tution Fee - Term 1"
    amount = Column(Float)
    due_date = Column(Date)
    batch_grade = Column(String) # Applies to which grade/batch

class FeeTransaction(Base):
    __tablename__ = "fee_transactions"

    id = Column(BigInteger, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount_paid = Column(Float)
    amount_due = Column(Float) # Remaining after this transaction
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # paid, partial, overdue
    receipt_number = Column(String, unique=True)

    student = relationship("Student", back_populates="fees")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # Mid-Term 2025
    start_date = Column(Date)
    end_date = Column(Date)

class ExamMark(Base):
    __tablename__ = "exam_marks"

    id = Column(BigInteger, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    subject = Column(String)
    marks_obtained = Column(Float)
    max_marks = Column(Float)

    student = relationship("Student", back_populates="marks")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_type = Column(String, nullable=False) # e.g. "lesson", "quiz", "chat"
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="conversations")

class GenerationLog(Base):
    __tablename__ = "generation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    task_type = Column(String, index=True)
    status = Column(String, default="pending")
    engine_used = Column(String)
    payload = Column(Text) # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    type = Column(String, index=True) # lesson-plan, quiz, story, etc.
    content_data = Column(Text) # The actual content (JSON or text)
    content_type = Column(String, default="text") # text, image, json
    tool_id = Column(String)
    
    book_id = Column(BigInteger, ForeignKey("books.id"), nullable=True)
    chapter_id = Column(BigInteger, ForeignKey("chapters.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="contents")
    book = relationship("Book", back_populates="contents")
    chapter = relationship("Chapter", back_populates="contents")

class Book(Base):
    __tablename__ = "books"
    
    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    grade_level = Column(String)
    subject = Column(String)
    cover_image = Column(String, nullable=True)
    
    chapters = relationship("Chapter", back_populates="book")
    contents = relationship("Content", back_populates="book")

class Chapter(Base):
    __tablename__ = "chapters"
    
    id = Column(BigInteger, primary_key=True, index=True)
    book_id = Column(BigInteger, ForeignKey("books.id"))
    title = Column(String)
    sequence_number = Column(Integer)
    content = Column(Text) # The chapter text content
    
    book = relationship("Book", back_populates="chapters")
    contents = relationship("Content", back_populates="chapter")
