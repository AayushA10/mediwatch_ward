from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

SECRET_KEY = "secret123"  # should match the one used in auth_routes

# Use HTTPBearer scheme
security = HTTPBearer()

def verify_token(token: str):
    try:
        print("🔐 Verifying token:", token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ✅ Use this as dependency
def require_role(allowed_roles: list):
    def role_checker(credentials: HTTPAuthorizationCredentials = Depends(security)):
        payload = verify_token(credentials.credentials)
        user_role = payload.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return True  # or return payload if you want to access inside route
    return role_checker
