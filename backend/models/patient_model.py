from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
from datetime import datetime


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="admitted")
    ward = Column(String)
    icu = Column(Boolean, default=False)
    admit_time = Column(DateTime, default=datetime.utcnow)
    discharge_time = Column(DateTime, nullable=True)
