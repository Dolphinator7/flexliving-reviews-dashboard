"""Review data models"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from .enums import ReviewSource, ReviewStatus


class ReviewBase(BaseModel):
    """Base review model"""
    property_id: str
    property_name: str
    guest_name: str
    rating: float = Field(..., ge=1.0, le=5.0)
    comment: str
    date: datetime
    source: ReviewSource
    
    @field_validator('rating')
    @classmethod
    def validate_rating(cls, v: float) -> float:
        """Ensure rating is between 1 and 5"""
        if not 1.0 <= v <= 5.0:
            raise ValueError('Rating must be between 1.0 and 5.0')
        return round(v, 1)


class Review(ReviewBase):
    """Full review model with metadata"""
    id: str
    status: ReviewStatus = ReviewStatus.PENDING
    response: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class ReviewFilters(BaseModel):
    """Query filters for reviews"""
    property_id: Optional[str] = None
    min_rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    max_rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    source: Optional[ReviewSource] = None
    status: Optional[ReviewStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    search: Optional[str] = None


class ReviewUpdate(BaseModel):
    """Model for updating review status"""
    status: ReviewStatus
    response: Optional[str] = None


class PropertyStats(BaseModel):
    """Property review statistics"""
    property_id: str
    property_name: str
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]
    recent_reviews: list[Review]
