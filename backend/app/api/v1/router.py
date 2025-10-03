"""API v1 router aggregator"""
from fastapi import APIRouter
from app.api.v1.endpoints import reviews, properties

api_router = APIRouter()

api_router.include_router(reviews.router, tags=["reviews"])
api_router.include_router(properties.router, tags=["properties"])
