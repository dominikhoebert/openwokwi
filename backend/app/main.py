from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import compile

app = FastAPI(
    title="Arduino Emulator API",
    description="Compilation and project management API",
    version="1.0.0"
)

# CORS for local development and Docker
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server (default)
        "http://localhost:5174",   # Vite dev server (alt)
        "http://localhost:5175",   # Vite dev server (alt)
        "http://localhost",        # Docker nginx (port 80)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(compile.router, prefix="/api/compile", tags=["compilation"])


@app.get("/")
def root():
    return {
        "message": "Arduino Emulator API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
