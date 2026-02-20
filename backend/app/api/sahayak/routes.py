from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.llm.providers.google_provider import GoogleProvider
import json
import re

router = APIRouter()
llm_provider = GoogleProvider()

class SahayakQuery(BaseModel):
    query: str
    context: Optional[str] = "general" # general, admission, fees, grades

class SahayakResponse(BaseModel):
    answer: str
    action_suggested: Optional[str] = None
    data_points: Optional[dict] = None
    sql_generated: Optional[str] = None

SYSTEM_PROMPT = """
You are Sahayak, an advanced AI Administrative Assistant for 'Learnivo High School'. 
Your role is to help the School Administrator with insights, drafting, and decision support.

CURRENT CONTEXT (Simulated Database):
- Total Students: 1,250
- Teachers: 42 (3 Absent today)
- Fees Pending: $45,000 (15% of total)
- Attendance Today: 94%
- Upcoming Holidays: Diwali (Oct 24), Winter Break (Dec 20)

INSTRUCTIONS:
1. Answer the user's query professionally and concisely.
2. If the user asks for data present in the context above, provide it.
3. If the user asks for specific data NOT in the context, say "I would need to query the live database for that specific record." (Do not hallucinate).
4. Suggest a relevant system action if applicable (e.g., 'Draft Notice', 'Send Reminder').
5. Output MUST be valid JSON with the following structure:
{
    "answer": "Your conversational response here.",
    "action_suggested": "Short Action Title" or null,
    "data_points": {Key: Value} or null
}
"""

@router.post("/ask", response_model=SahayakResponse)
async def ask_sahayak(query: SahayakQuery):
    """
    Main endpoint for Sahayak Admin Bot.
    Processes natural language queries via Google Gemini and returns actionable insights.
    """
    try:
        full_prompt = f"{SYSTEM_PROMPT}\n\nUSER QUERY: {query.query}\n\nJSON RESPONSE:"
        
        # Call LLM
        response_text = await llm_provider.generate(full_prompt)
        
        # Clean specific markdown wrapping if present
        clean_text = re.sub(r'```json\s*|\s*```', '', response_text).strip()
        
        # Parse JSON
        try:
            parsed_response = json.loads(clean_text)
        except json.JSONDecodeError:
            # Fallback if LLM fails to generate valid JSON
            return SahayakResponse(
                answer=response_text,
                action_suggested=None,
                data_points=None
            )
            
        return SahayakResponse(
            answer=parsed_response.get("answer", "I processed your request."),
            action_suggested=parsed_response.get("action_suggested"),
            data_points=parsed_response.get("data_points")
        )

    except Exception as e:
        print(f"Sahayak Error: {str(e)}")
        # Graceful degradation
        return SahayakResponse(
            answer="I am currently experiencing high traffic. Please try again in a moment.",
            action_suggested=None
        )
