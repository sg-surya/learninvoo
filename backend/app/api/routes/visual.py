from fastapi import APIRouter, HTTPException
from app.schemas.visual import VisualRequest, VisualResponse, GeneratedVisual
from app.llm.router import LLMRouter
import uuid
import os
import asyncio
import httpx
import time
import urllib.parse
import json
import re

router = APIRouter()

async def generate_image_with_pollinations(prompt: str) -> str:
    """
    Generate an image using Pollinations.ai (Stable Diffusion).
    This is a free, open API that generates images from text prompts.
    Perfect for educational visuals when no paid provider is available.
    """
    try:
        # Clean and encode prompt
        # Force specific styles for better educational results
        enhanced_prompt = f"{prompt}, educational diagram, scientific illustration, clear labels, white background, high quality, 4k"
        encoded_prompt = urllib.parse.quote(enhanced_prompt)
        
        # Pollinations URL pattern
        # Adding seed for consistency but randomness across requests
        seed = int(time.time() * 1000) % 100000
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"
        
        # We can just return the URL directly as Pollinations generates on-the-fly
        # But let's verify it works with a quick HEAD request
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.head(url)
            if response.status_code == 200:
                print(f"[POLLINATIONS] Generated URL for: {prompt[:30]}...")
                return url
            else:
                print(f"[POLLINATIONS] HEAD check failed: {response.status_code}")
                # Fallback to the URL anyway, it might just feature dynamic content
                return url
                
    except Exception as e:
        print(f"Pollinations generation error: {e}")
        # Fallback to a placeholder if all else fails
        return f"https://placehold.co/1024x1024/EEE/31343C?text={urllib.parse.quote(prompt)}"

@router.post("/generate", response_model=VisualResponse)
async def generate_visual(request: VisualRequest):
    """
    Generate educational visuals using AI.
    Integrates LLM for prompt engineering + Pollinations.ai for image generation.
    """
    try:
        llm = LLMRouter()
        
        # 1. Generate specialized image prompts using LLM
        prompt_engineering_context = f"""
        Topic: {request.topic}
        Grade: {request.grade}
        Style: {request.visual_style} (e.g. Minimalist, Realistic, Diagram, Cartoon)
        """
        
        llm_prompt = f"""
        You are an expert educational illustrator. valid JSON array ONLY.
        Create 4 detailed image generation prompts for "{request.topic}" suitable for {request.grade} students.
        
        Style requirement: {request.visual_style}
        
        The prompts must be highly descriptive to generate accurate educational images.
        Include keywords like "diagram", "labels", "cross-section", "close-up" where appropriate.
        
        Return ONLY valid JSON array:
        [
            {{"prompt": "Detailed description of image 1", "style": "{request.visual_style}"}},
            {{"prompt": "Detailed description of image 2", "style": "{request.visual_style}"}},
            {{"prompt": "Detailed description of image 3", "style": "{request.visual_style}"}},
            {{"prompt": "Detailed description of image 4", "style": "{request.visual_style}"}}
        ]
        """

        try:
            # Get prompts from LLM
            response = await llm.generate(llm_prompt)
            print(f"[DEBUG] LLM Response: {response[:200]}...")
            
            # Helper to extract JSON
            json_str = response
            match = re.search(r'\[.*\]', response, re.DOTALL)
            if match:
                json_str = match.group()
            
            prompts_data = json.loads(json_str)
            
        except Exception as e:
            print(f"[ERROR] LLM Prompt Generation failed: {e}")
            # Fallback prompts if LLM fails
            prompts_data = [
                {"prompt": f"Educational diagram of {request.topic}", "style": request.visual_style},
                {"prompt": f"Illustration of {request.topic} for students", "style": request.visual_style},
                {"prompt": f"Detailed view of {request.topic}", "style": request.visual_style},
                {"prompt": f"Poster about {request.topic}", "style": request.visual_style}
            ]

        # 2. Generate Images using Pollinations
        print(f"\n[INFO] Generating {len(prompts_data)} images for: {request.topic} via Pollinations.ai\n")
        
        image_tasks = []
        for item in prompts_data:
            p = item.get("prompt", request.topic)
            image_tasks.append(generate_image_with_pollinations(p))
            
        image_urls = await asyncio.gather(*image_tasks)
        
        # 3. Construct Response
        visuals = []
        for i, (item, url) in enumerate(zip(prompts_data, image_urls)):
            visuals.append(GeneratedVisual(
                id=str(uuid.uuid4()),
                url=url,
                style=item.get("style", request.visual_style),
                prompt=item.get("prompt", request.topic)
            ))
            
        return VisualResponse(visuals=visuals)

    except Exception as e:
        print(f"Visual generation endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
