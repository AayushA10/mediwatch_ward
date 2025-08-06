# models/user_model.py
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)  # hash this later
    role = Column(String)  # e.g., admin, doctor, nurse, viewer
