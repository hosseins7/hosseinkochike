from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class Prompt(BaseModel):
    prompt: str

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

