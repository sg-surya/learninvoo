from app.llm.providers.base import BaseLLMProvider
import asyncio

class MockProvider(BaseLLMProvider):
    async def generate(self, prompt: str) -> str:
        # Simulate network delay
        await asyncio.sleep(1)
        
        # Simple heuristic to return semi-relevant content
        if "lesson plan" in prompt.lower():
            return """
## Weekly Lesson Plan: Introduction to Topic

**Objective:** Students will understand the core concepts.

### Day 1: Introduction
- **Activity:** Open discussion about the topic.
- **Resource:** Textbooks page 24-30.

### Day 2: Deep Dive
- **Activity:** Group work and presentations.
- **Assessment:** Short quiz.

### Day 3: Practical Application
- **Activity:** Real-world examples.
- **Homework:** Write a short essay.
"""
        elif "quiz" in prompt.lower():
            return """
## Generated Quiz

**1. What is the main concept of this topic?**
   a) Concept A
   b) Concept B
   c) Concept C
   d) All of the above

**2. Which of the following is true?**
   a) Statement 1
   b) Statement 2
   c) Statement 3
"""
        elif "story" in prompt.lower():
            return """
**Title: The Adventure of Learning**

Once upon a time, there was a student who loved to learn. They asked many questions and explored the world around them.
One day, they discovered a magical book that could answer any question...
"""
        else:
            return "Generated content from backend provider."
