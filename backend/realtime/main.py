import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from realtime.routes import test_session, proctoring

app = FastAPI(title="SARAS Real-Time Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Could restrict based on env config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_session.router)
app.include_router(proctoring.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("realtime.main:app", host="0.0.0.0", port=8001, reload=True)
