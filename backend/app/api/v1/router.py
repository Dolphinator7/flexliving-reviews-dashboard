from fastapi import APIRouter
from app.api.v1.endpoints import reviews, properties

api_router = APIRouter()

# ✅ Correct prefixes
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(properties.router, tags=["properties"]) 
