from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatientCreate(BaseModel):
    name: str
    ward: str
    icu: bool
    id: Optional[int] = None

class PatientResponse(BaseModel):
    id: int
    name: str
    status: str
    ward: str
    icu: bool
    admit_time: datetime
    discharge_time: Optional[datetime]

    class Config:
        from_attributes = True  # 🔁 Updated from orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str
