import asyncio
from app.db.session import AsyncSessionLocal
from app.db import init_data

async def init():
    async with AsyncSessionLocal() as db:
        await init_data.create_mock_books(db)

if __name__ == "__main__":
    asyncio.run(init())
