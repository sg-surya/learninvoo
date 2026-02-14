from fastapi import APIRouter, HTTPException
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.llm.router import LLMRouter

router = APIRouter()

@router.post("/generate", response_model=SimulationResponse)
async def generate_simulation(request: SimulationRequest):
    """
    Generate an interactive simulation based on a topic.
    """
    try:
        llm = LLMRouter()
        
        prompt = f"""You are a simulation designer. Generate a detailed interactive simulation specification for education.

Topic: {request.topic}
Grade Level: {request.grade}
Complexity: {request.complexity}

Please provide:
1. A catchy title for the simulation
2. 2-4 adjustable parameters with realistic ranges and units
3. The core scientific/mathematical logic or formula
4. A brief description of what students will learn

Format your response as JSON with these exact fields:
{{
    "title": "The Simulation Title",
    "topic": "{request.topic}",
    "parameters": [
        {{"id": "param1", "label": "Parameter Name", "min": 0, "max": 100, "step": 1, "unit": "units", "defaultValue": 50}},
        {{"id": "param2", "label": "Another Parameter", "min": 0, "max": 10, "step": 0.1, "unit": "m/s", "defaultValue": 5}}
    ],
    "logic": "Formula or relationship (e.g., F = m * a}}", 
    "description": "What students will learn from this simulation"
}}

Generate realistic parameters that match the topic."""

        response = await llm.generate(prompt)
        
        # Try to parse JSON from response
        import json
        import re
        
        # Extract JSON from the response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            sim_data = json.loads(json_match.group())
            return SimulationResponse(**sim_data)
        else:
            # Fallback if AI doesn't return proper JSON
            raise ValueError("Could not parse simulation data")
            
    except Exception as e:
        print(f"Simulation generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
