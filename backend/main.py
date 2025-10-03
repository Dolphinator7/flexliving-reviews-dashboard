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

# Initialize FastAPI app
app = FastAPI(
    title="Flex Living Reviews API",
    version=settings.VERSION,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
)

# Configure CORS
setup_cors(app)

# Error handlers
app.add_exception_handler(StarletteHTTPException, http_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(Exception, general_error_handler)

# API routes
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {
        "message": "Flex Living Reviews API",
        "version": settings.VERSION,
        "docs": f"{settings.API_PREFIX}/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
