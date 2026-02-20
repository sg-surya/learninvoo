from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.db.models import Chapter, Book
import asyncio

class RAGService:
    """
    Retrieval-Augmented Generation Service.
    Fetches relevant content from the database (Books/Chapters) to provide context for LLM generation.
    """
    
    @staticmethod
    async def get_context(book_id: str | int = None, chapter_ids: list[str | int] = None) -> str:
        """
        Retrieves content from specified book/chapters.
        """
        if not book_id and not chapter_ids:
            return ""

        context_parts = []
        
        async with AsyncSessionLocal() as session:
            try:
                # Retrieve specific chapters if provided
                if chapter_ids:
                    # Convert IDs to int if they are strings
                    c_ids = [int(cid) for cid in chapter_ids if str(cid).isdigit()]
                    
                    if c_ids:
                        stmt = select(Chapter).where(Chapter.id.in_(c_ids))
                        result = await session.execute(stmt)
                        chapters = result.scalars().all()
                        
                        for chapter in chapters:
                            content = chapter.content or ""
                            # Simple clean up
                            content = content.strip()
                            if content:
                                context_parts.append(f"CHAPTER TITLE: {chapter.title}\nCONTENT:\n{content}\n")
                
                # If only book_id provided (retrieve all chapters? or summary? Limit to first few?)
                # For now, let's focus on selected chapters as per user request "jo chapter vo select kren"
                elif book_id:
                    # Retrieve all chapters for the book (might be too large, but let's try)
                    b_id = int(book_id) if str(book_id).isdigit() else None
                    if b_id:
                        stmt = select(Chapter).where(Chapter.book_id == b_id).order_by(Chapter.sequence_number)
                        result = await session.execute(stmt)
                        chapters = result.scalars().all()
                        
                        context_parts.append(f"BOOK ID: {book_id} (Full Text)")
                        for chapter in chapters:
                             content = chapter.content or ""
                             if content:
                                 context_parts.append(f"CHAPTER: {chapter.title}\n{content}\n")

            except Exception as e:
                print(f"[RAG SERVICE ERROR] Failed to retrieve context: {e}")
                return ""

        return "\n".join(context_parts)
