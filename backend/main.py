import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from eligibility import check_eligibility

app = FastAPI(title="GovSchemeChecker API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load schemes from JSON
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SCHEMES_PATH = os.path.join(os.path.dirname(__file__), "schemes.json")
with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
    SCHEMES = json.load(f)

class UserInput(BaseModel):
    age: int
    income: int
    state: str
    occupation: str
    gender: str
    education: str

@app.post("/check")
async def check(user_input: UserInput):
    user = user_input.dict()
    eligible_schemes = []
    not_eligible_schemes = []

    for scheme in SCHEMES:
        result = check_eligibility(user, scheme)
        
        scheme_data = {
            "name": scheme["name"],
            "description": scheme["description"],
            "apply_link": scheme["apply_link"],
            "type": scheme["type"]
        }

        if result["eligible"]:
            scheme_data["why_eligible"] = result["reasons"]
            eligible_schemes.append(scheme_data)
        else:
            scheme_data["why_not"] = result["rejection_reasons"]
            not_eligible_schemes.append(scheme_data)

    return {
        "eligible_schemes": eligible_schemes,
        "not_eligible_schemes": not_eligible_schemes
    }

# Serve Frontend - Must be mounted AFTER other routes
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
if os.path.exists(FRONTEND_DIR):
    # Mount frontend files at root
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
