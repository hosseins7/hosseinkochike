from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class Query(BaseModel):
    prompt: str

@app.post("/ask")
async def ask_ai(data: Query):
    prompt = data.prompt
    
    response = requests.post(
        "http://ollama:11434/api/generate",
        json={"model": "phi3", "prompt": prompt}
    )

    return {"response": response.json().get("response", "")}

@app.get("/")
def root():
    return {"message": "AI DevOps Assistant"}

