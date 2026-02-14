import asyncio
import sys
sys.path.append('.')

from app.engines.story_engine import StoryEngine

async def test():
    engine = StoryEngine()
    result = await engine.generate({
        "topic": "A brave squirrel",
        "grade": "Grade 3",
        "genre": "Adventure"
    })
    print("=== RESULT ===")
    print(result)
    print("\n=== CHECK IF MOCK ===")
    if "MockProvider" in result or "No valid LLM API key" in result:
        print("❌ USING MOCK DATA")
    else:
        print("✅ USING REAL AI")

if __name__ == "__main__":
    asyncio.run(test())
