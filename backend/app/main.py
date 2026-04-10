from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

