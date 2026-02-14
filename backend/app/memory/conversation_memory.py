from app.db.session import AsyncSessionLocal
from app.db.models import Conversation
from sqlalchemy.ext.asyncio import AsyncSession

class ConversationMemory:

    async def save(self, user_id: int, message: str, task_type: str = "chat", response: str = None):
        async with AsyncSessionLocal() as db:
            conv = Conversation(
                user_id=user_id, 
                message=message, 
                task_type=task_type,
                response=response
            )
            db.add(conv)
            await db.commit()
            await db.refresh(conv)
            return conv
