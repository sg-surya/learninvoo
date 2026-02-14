from pydantic import BaseModel
from typing import List

class SimulationParameter(BaseModel):
    id: str
    label: str
    min: float
    max: float
    step: float
    unit: str
    defaultValue: float

class SimulationRequest(BaseModel):
    topic: str
    grade: str
    complexity: str

class SimulationResponse(BaseModel):
    title: str
    topic: str
    parameters: List[SimulationParameter]
    logic: str
    description: str
