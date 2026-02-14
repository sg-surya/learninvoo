from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

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
    
    book_id = Column(Integer, ForeignKey("books.id"), nullable=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="contents")
    book = relationship("Book", back_populates="contents")
    chapter = relationship("Chapter", back_populates="contents")

class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    grade_level = Column(String)
    subject = Column(String)
    cover_image = Column(String, nullable=True)
    
    chapters = relationship("Chapter", back_populates="book")
    contents = relationship("Content", back_populates="book")

class Chapter(Base):
    __tablename__ = "chapters"
    
    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    title = Column(String)
    sequence_number = Column(Integer)
    content = Column(Text) # The chapter text content
    
    book = relationship("Book", back_populates="chapters")
    contents = relationship("Content", back_populates="chapter")
