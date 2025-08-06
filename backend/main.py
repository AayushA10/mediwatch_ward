from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔌 Import routers
from routes import patient_routes, ward_routes, auth_routes
from database import engine
from models import patient_model

# 🛠️ Create all tables
patient_model.Base.metadata.create_all(bind=engine)

# 🚀 FastAPI app init
app = FastAPI(title="MediWatch 🏥 Hospital Flow API")

# 🌍 Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production to allow only your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📍 Root route
@app.get("/")
def root():
    return {"message": "MediWatch backend running 🚑"}

# 🔗 Register routers
app.include_router(patient_routes.router, prefix="/api")
app.include_router(ward_routes.router, prefix="/api")
app.include_router(auth_routes.router, prefix="/api")  # ✅ Add this line for /api/login
