from fastapi import APIRouter
from models.schemas import Ward
from typing import List
import json
import os

router = APIRouter()

# Load wards from JSON once
data_path = os.path.join(os.path.dirname(__file__), "..", "data", "init_data.json")

with open(data_path) as f:
    data = json.load(f)
    wards = [Ward(**ward) for ward in data["wards"]]

@router.get("/wards", response_model=List[Ward])
def get_all_wards():
    return wards

@router.post("/wards")
def add_ward(ward: Ward):
    wards.append(ward)
    return {"message": "Ward added successfully"}

@router.get("/wards/status")
def get_ward_status():
    ward_status = []

    for ward in wards:
        occupancy = ward.occupied_beds / ward.total_beds
        status = "Normal"
        action = "No action needed"

        if occupancy >= 0.9:
            status = "Critical"
            action = f"⚠️ ICU '{ward.name}' is over 90% full. Consider reallocating resources."
        elif occupancy >= 0.75:
            status = "Warning"
            action = f"🔶 '{ward.name}' nearing full capacity. Monitor closely."

        ward_status.append({
            "ward": ward.name,
            "occupied": ward.occupied_beds,
            "total": ward.total_beds,
            "occupancy_percent": round(occupancy * 100, 1),
            "status": status,
            "action": action
        })

    return ward_status

