from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Chat --------

class Prompt(BaseModel):
    prompt: str


@app.options("/ask")
async def options_ask():
    return Response(status_code=200)


@app.post("/ask")
async def ask_ai(data: Prompt):

    response = requests.post(
        "http://ollama:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": data.prompt,
            "stream": False
        }
    )

    result = response.json()

    return {"response": result.get("response", "")}


# -------- Incident Investigation --------

class IncidentRequest(BaseModel):
    alert: str
    logs: str | None = None


@app.post("/investigate")
async def investigate(data: IncidentRequest):

    prompt = f"""
You are a senior DevOps and SRE engineer.

Investigate the following incident.

Alert:
{data.alert}

Logs:
{data.logs}

Return your answer in this structure:

1. Possible Cause
2. Investigation Steps
3. Recommended Fix
"""

    response = requests.post(
        "http://ollama:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    result = response.json()

    return {"analysis": result.get("response", "")}

