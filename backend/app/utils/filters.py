"""Query filtering utilities"""
from typing import List, Optional
from datetime import datetime
from app.models.review import Review
from app.models.enums import ReviewStatus, ReviewSource


def filter_reviews(
    reviews: List[Review],
    status: Optional[ReviewStatus] = None,
    source: Optional[ReviewSource] = None,
    property_id: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None
) -> List[Review]:
    """
    Filter reviews based on multiple criteria
    
    Args:
        reviews: List of reviews to filter
        status: Filter by approval status
        source: Filter by review source
        property_id: Filter by property ID
        min_rating: Minimum rating (inclusive)
        max_rating: Maximum rating (inclusive)
        start_date: Start date for review range
        end_date: End date for review range
        search: Search term for guest name or review text
        
    Returns:
        Filtered list of reviews
    """
    filtered = reviews
    
    if status:
        filtered = [r for r in filtered if r.status == status]
    
    if source:
        filtered = [r for r in filtered if r.source == source]
    
    if property_id:
        filtered = [r for r in filtered if r.property_id == property_id]
    
    if min_rating is not None:
        filtered = [r for r in filtered if r.rating >= min_rating]
    
    if max_rating is not None:
        filtered = [r for r in filtered if r.rating <= max_rating]
    
    if start_date:
        filtered = [r for r in filtered if r.date >= start_date]
    
    if end_date:
        filtered = [r for r in filtered if r.date <= end_date]
    
    if search:
        search_lower = search.lower()
        filtered = [
            r for r in filtered
            if search_lower in r.guest_name.lower() or search_lower in r.text.lower()
        ]
    
    return filtered


def sort_reviews(
    reviews: List[Review],
    sort_by: str = "date",
    descending: bool = True
) -> List[Review]:
    """
    Sort reviews by specified field
    
    Args:
        reviews: List of reviews to sort
        sort_by: Field to sort by (date, rating, guest_name)
        descending: Sort in descending order
        
    Returns:
        Sorted list of reviews
    """
    reverse = descending
    
    if sort_by == "date":
        return sorted(reviews, key=lambda r: r.date, reverse=reverse)
    elif sort_by == "rating":
        return sorted(reviews, key=lambda r: r.rating, reverse=reverse)
    elif sort_by == "guest_name":
        return sorted(reviews, key=lambda r: r.guest_name.lower(), reverse=reverse)
    
    return reviews
