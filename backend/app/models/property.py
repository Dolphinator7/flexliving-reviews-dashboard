"""Property data models"""
from pydantic import BaseModel


class Property(BaseModel):
    """Property model"""
    id: str
    name: str
    address: str
    city: str
    image_url: str
    total_reviews: int = 0
    average_rating: float = 0.0
