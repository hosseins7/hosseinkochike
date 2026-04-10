from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI DevOps Assistant"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask")
def ask_ai(question: str):

    r = requests.post(
        "http://ollama:11434/api/generate",
        json={
            "model": "phi3",
            "prompt": question,
            "stream": False
        }
    )

    return r.json()

