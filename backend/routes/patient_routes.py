from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import SessionLocal
from models.patient_model import Patient
from schemas.schema import PatientCreate, PatientResponse
from dependencies.auth import require_role

router = APIRouter()

# 📦 DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🏥 Admit a patient — allowed: admin, doctor
@router.post(
    "/patients",
    response_model=PatientResponse,
    dependencies=[Depends(require_role(["admin", "doctor"]))]
)
def admit_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = Patient(
        id=patient.id,
        name=patient.name,
        ward=patient.ward,
        icu=patient.icu,
        status="admitted",
        admit_time=datetime.utcnow()
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

# 🔁 Discharge a patient — allowed: admin, doctor
@router.put(
    "/patients/{patient_id}/discharge",
    response_model=PatientResponse,
    dependencies=[Depends(require_role(["admin", "doctor"]))]
)
def discharge_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.status = "discharged"
    patient.discharge_time = datetime.utcnow()
    db.commit()
    db.refresh(patient)
    return patient

# 📋 List all patients — allowed: admin, doctor, nurse
@router.get(
    "/patients",
    response_model=List[PatientResponse],
    dependencies=[Depends(require_role(["admin", "doctor", "nurse"]))]
)
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

# 🔍 Search & Filter patients — allowed: admin, doctor, nurse
@router.get(
    "/patients/search",
    response_model=List[PatientResponse],
    dependencies=[Depends(require_role(["admin", "doctor", "nurse"]))]
)
def search_patients(
    name: str = None,
    ward: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Patient)
    if name:
        query = query.filter(Patient.name.ilike(f"%{name}%"))
    if ward:
        query = query.filter(Patient.ward.ilike(f"%{ward}%"))
    if status:
        query = query.filter(Patient.status == status)
    return query.all()
