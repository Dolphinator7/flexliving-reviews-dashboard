from fastapi import APIRouter
from .endpoints import reviews, properties

api_router = APIRouter()
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
