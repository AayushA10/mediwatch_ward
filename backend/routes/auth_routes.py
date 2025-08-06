from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from models.user_model import User
from schemas.schema import UserLogin
from database import get_db
import jwt

router = APIRouter()
SECRET_KEY = "secret123"  # use environment variable in production

# 🛡️ Security scheme
security = HTTPBearer()

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT with username and role
    token_data = {"username": db_user.username, "role": db_user.role}
    token = jwt.encode(token_data, SECRET_KEY, algorithm="HS256")

    return {"access_token": token, "role": db_user.role}

@router.post("/create-test-user")
def create_test_user(db: Session = Depends(get_db)):
    test_user = User(username="admin", password="admin123", role="admin")
    db.add(test_user)
    db.commit()
    return {"message": "Test user created"}

# ✅ Add this for debugging tokens
@router.get("/verify-token")
def test_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"token": credentials.credentials}
