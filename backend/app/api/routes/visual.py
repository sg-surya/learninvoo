from fastapi import APIRouter, HTTPException
from app.schemas.visual import VisualRequest, VisualResponse, GeneratedVisual
from app.llm.router import LLMRouter
import uuid
import os
import asyncio
import httpx
import time

router = APIRouter()

async def generate_image_with_fireworks(prompt: str) -> str:
    """
    Generate an image using Fireworks AI Flux Kontext Pro model.
    Uses async generation with request_id polling.
    Returns the image URL.
    """
    try:
        api_key = os.getenv("FIREWORKS_API_KEY")
        
        if not api_key:
            print("No Fireworks API key, using placeholder")
            return f"https://picsum.photos/seed/{abs(hash(prompt))}/800/600"
        
        # Step 1: Submit image generation request
        url = "https://api.fireworks.ai/inference/v1/image_generation/accounts/fireworks/models/flux-kontext-pro"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": prompt,
            "aspect_ratio": "1:1",
            "output_format": "jpeg",
            "safety_tolerance": 2
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            # Submit generation request
            response = await client.post(url, json=payload, headers=headers)
            
            if response.status_code != 200:
                print(f"Fireworks API error: {response.status_code} - {response.text[:200]}")
                return f"https://picsum.photos/seed/{abs(hash(prompt))}/800/600"
            
            data = response.json()
           
            # Check if we got a direct URL or request_id
            if "url" in data:
                print(f"Got image directly: {prompt[:40]}...")
                return data["url"]
            elif "request_id" in data:
                request_id = data["request_id"]
                print(f"Got request_id: {request_id}, polling for result...")
                
                # Step 2: Poll for the result
                status_url = f"https://api.fireworks.ai/inference/v1/image_generation/status/{request_id}"
                max_retries = 30  # 30 * 2 seconds = 60 seconds max wait
                
                for attempt in range(max_retries):
                    await asyncio.sleep(2)  # Wait 2 seconds between polls
                    
                    status_response = await client.get(status_url, headers=headers)
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        
                        if status_data.get("status") == "Ready":
                            image_url = status_data.get("url")
                            if image_url:
                                print(f"Image ready: {prompt[:40]}...")
                                return image_url
                        elif status_data.get("status") == "Failed":
                            print(f"Image generation failed for: {prompt[:40]}")
                            break
                
                print(f"Timeout waiting for image: {prompt[:40]}")
                return f"https://picsum.photos/seed/{abs(hash(prompt))}/800/600"
            else:
                print(f"Unexpected response format: {data}")
                return f"https://picsum.photos/seed/{abs(hash(prompt))}/800/600"
        
    except Exception as e:
        print(f"Fireworks image error: {e}")
        return f"https://picsum.photos/seed/{abs(hash(prompt))}/800/600"

@router.post("/generate", response_model=VisualResponse)
async def generate_visual(request: VisualRequest):
    """
    Generate educational visuals using AI.
    Uses Fireworks AI Flux Kontext Pro model for actual image generation.
    """
    try:
        llm = LLMRouter()
        
        # Create a detailed prompt for image generation
        context = f"Topic: {request.topic}\nGrade: {request.grade}\nStyle: {request.visual_style}"
        if request.source_mode == "book" and request.book_title:
            context += f"\nSource: {request.book_title}"
            if request.chapters:
                context += f"\nChapters: {', '.join(request.chapters)}"
        
        prompt = f"""Generate 4 detailed image generation prompts about "{request.topic}" for {request.grade} students in {request.visual_style} style.

Requirements:
- Each prompt MUST start with "{request.topic}"
- Be specific about visual elements, colors, labels
- {request.visual_style} art style
- Educational and accurate for {request.grade}

Create 4 prompts:
1. Main concept visualization
2. Detailed labeled diagram  
3. Real-world example
4. Step-by-step process

Return ONLY valid JSON array (no markdown, no extra text):
[
  {{"id": "1", "prompt": "Photosynthesis process showing sunlight hitting chloroplast in green leaf cell, with labeled arrows for CO2 input, H2O, and O2 output. Scientific diagram style with clear labels, bright green chloroplast, yellow sunlight rays, blue arrows. Educational diagram for high school biology", "style": "{request.visual_style}"}},
  {{"id": "2", "prompt": "...", "style": "{request.visual_style}"}},
  {{"id": "3", "prompt": "...", "style": "{request.visual_style}"}},
  {{"id": "4", "prompt": "...", "style": "{request.visual_style}"}}
]

Generate for topic: {request.topic}"""

        response = await llm.generate(prompt)
        
        print(f"[DEBUG] LLM Response for prompts:\n{response[:500]}...\n")
        
        # Parse JSON from response
        import json
        import re
        
        json_match = re.search(r'\[[\s\S]*\]', response)
        if json_match:
            try:
                prompts_data = json.loads(json_match.group())
                print(f"[DEBUG] Successfully parsed {len(prompts_data)} prompts")
                
                # Log each prompt
                for i, p in enumerate(prompts_data[:4], 1):
                    print(f"[DEBUG] Prompt {i}: {p.get('prompt', 'NO PROMPT')[:100]}...")
                
            except json.JSONDecodeError as e:
                print(f"[ERROR] JSON parse failed: {e}")
                print(f"[DEBUG] Attempted to parse: {json_match.group()[:300]}...")
                raise ValueError("Could not parse JSON prompts")
            
            # Generate actual images using Fireworks AI
            print(f"\n[INFO] Generating {len(prompts_data[:4])} images for: {request.topic}\n")
            
            # Generate images in parallel with ENHANCED prompts
            image_tasks = []
            for i, prompt_item in enumerate(prompts_data[:4], 1):
                base_prompt = prompt_item.get('prompt', f"Educational diagram of {request.topic}")
                
                # Enhance prompt further for better image quality
                enhanced_prompt = f"{base_prompt}. High quality, detailed, professional educational illustration, {request.visual_style} art style, clear and informative for {request.grade} students, accurate representation of {request.topic}"
                
                print(f"[FIREWORKS] Image {i} prompt: {enhanced_prompt[:150]}...")
                image_tasks.append(generate_image_with_fireworks(enhanced_prompt))
            
            image_urls = await asyncio.gather(*image_tasks)
            
            # Create visual objects
            visuals = []
            for i, (prompt_item, image_url) in enumerate(zip(prompts_data[:4], image_urls)):
                visual = GeneratedVisual(
                    id=str(uuid.uuid4()),
                    url=image_url,
                    style=prompt_item.get('style', request.visual_style),
                    prompt=prompt_item.get('prompt', '')
                )
                visuals.append(visual)
            
            print(f"Successfully generated {len(visuals)} visual assets")
            return VisualResponse(visuals=visuals)
        else:
            raise ValueError("Could not parse visual prompts")
            
    except Exception as e:
        print(f"Visual generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

