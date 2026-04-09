from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Ops Assistant Running", "app": "hosseinkochike"}

@app.get("/health")
def health():
    return {"status": "ok"}

