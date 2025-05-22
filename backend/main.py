import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Routers
from routers.auth_routers.auth_routers import router as auth_router
from routers.auth_routers.protected_auth import router as protected_router
from routers.process_routers.company_dashboard import router as company_dashboard_router
from routers.process_routers.user_dashboard import router as user_dashboard_router
from routers.process_routers.stt_router import router as stt_router

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app instance
app = FastAPI()

# Ensure 'public' folder exists
os.makedirs("public", exist_ok=True)
app.mount("/public", StaticFiles(directory="public"), name="public")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(company_dashboard_router)
app.include_router(user_dashboard_router)
app.include_router(stt_router)


@app.get("/")
async def root():
    return {"message": "🤖 AI Powered Call Center is running!"}