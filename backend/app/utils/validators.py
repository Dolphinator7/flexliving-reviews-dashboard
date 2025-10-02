"""Custom validation utilities"""
from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status


def validate_date_range(
    start_date: Optional[datetime],
    end_date: Optional[datetime]
) -> None:
    """
    Validate that start_date is before end_date
    
    Raises:
        HTTPException: If date range is invalid
    """
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before end_date"
        )


def validate_rating(rating: float) -> None:
    """
    Validate that rating is within valid range (1-5)
    
    Raises:
        HTTPException: If rating is invalid
    """
    if not 1.0 <= rating <= 5.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1.0 and 5.0"
        )


def validate_property_id(property_id: str) -> None:
    """
    Validate property ID format
    
    Raises:
        HTTPException: If property ID is invalid
    """
    if not property_id or not property_id.startswith("prop_"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid property ID format"
        )
