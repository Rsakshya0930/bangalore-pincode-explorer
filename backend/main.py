from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Optional

app = FastAPI()

# Enable CORS for React frontend [cite: 48]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset into memory [cite: 47]
with open("pincodes.json", "r") as f:
    pincodes_data = json.load(f)

@app.get("/api/lookup")
def lookup(pincode: Optional[str] = None, area: Optional[str] = None):
    """Returns area/pincode details based on search query."""
    if pincode:
        for entry in pincodes_data:
            if entry["pincode"] == pincode:
                return entry
        raise HTTPException(status_code=404, detail="Pincode not found")
    elif area:
        # Partial matching bonus feature [cite: 32]
        for entry in pincodes_data:
            if area.lower() in entry["area"].lower():
                return entry
        raise HTTPException(status_code=404, detail="Area not found")
    else:
        raise HTTPException(status_code=400, detail="Provide either pincode or area")

@app.get("/api/areas")
def get_areas():
    """Returns full list of all 25+ areas[cite: 50]."""
    return pincodes_data

# Run locally on port 8000 using: uvicorn main:app --reload [cite: 51]