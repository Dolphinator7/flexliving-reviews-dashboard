from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.api.v1.router import api_router
from app.middleware.cors import setup_cors
from app.middleware.error_handler import (
    http_error_handler,
    validation_error_handler,
    general_error_handler,
)

app = FastAPI(
    title="Flex Living Reviews API",
    description="Backend API for managing property reviews, analytics, and integrations.",
    version=settings.VERSION,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url=f"{settings.API_PREFIX}/docs",       # Swagger docs available under /api/v1/docs
    redoc_url=f"{settings.API_PREFIX}/redoc",     # Alternative docs at /api/v1/redoc
)

origins = [
    "http://localhost:3000",
    "https://flexliving-reviews-dashboard-lovat.vercel.app",
    "https://welcoming-playfulness-production.up.railway.app"  # if frontend needs to call itself
]

setup_cors(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register custom error handlers
app.add_exception_handler(StarletteHTTPException, http_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(Exception, general_error_handler)

# ✅ Mount API routes
app.include_router(api_router, prefix=settings.API_PREFIX)

# -------------------------
# Health & Root Endpoints
# -------------------------

@app.get("/", tags=["system"])
async def root():
    """Root endpoint with basic API info"""
    return {
        "message": "Flex Living Reviews API",
        "version": settings.VERSION,
        "docs": f"{settings.API_PREFIX}/docs",
        "health": "/health"
    }


@app.get("/health", tags=["system"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}
