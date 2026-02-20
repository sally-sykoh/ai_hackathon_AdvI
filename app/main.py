"""
AdvI Backend — FastAPI application entry point.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import student_router, faculty_router
from app.db.seed import seed_databases

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)

app = FastAPI(
    title="AdvI API",
    description="Backend for the AdvI education platform — AI Agent + LLM API",
    version="0.1.0",
)

# Seed databases on startup
@app.on_event("startup")
async def startup_event():
    seed_databases()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(faculty_router)


@app.get("/")
async def root():
    return {"service": "AdvI API", "status": "running"}
