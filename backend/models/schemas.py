from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Patient(BaseModel):
    id: int
    name: str
    status: str  # admitted / discharged
    ward: str
    icu: bool = False
    admit_time: datetime
    discharge_time: Optional[datetime] = None

class Ward(BaseModel):
    id: int
    name: str
    total_beds: int
    occupied_beds: int
