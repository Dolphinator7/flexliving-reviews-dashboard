"""Review API endpoints"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.review import Review, ReviewFilters, ReviewUpdate, PropertyStats
from app.models.enums import ReviewStatus, ReviewSource, SortField
from app.core.normalizers.hostaway import HostawayNormalizer
from app.core.aggregators.analytics import calculate_property_stats, calculate_overall_stats
from app.api.deps import get_hostaway_normalizer
import json
from pathlib import Path

router = APIRouter()

# In-memory storage (replace with database in production)
_reviews_cache: list[Review] = []


def _load_mock_data(normalizer: HostawayNormalizer) -> list[Review]:
    """Load and normalize mock review data"""
    global _reviews_cache
    
    if _reviews_cache:
        return _reviews_cache
    
    mock_file = Path(__file__).parent.parent.parent.parent.parent / "data" / "mock_reviews.json"
    
    if mock_file.exists():
        with open(mock_file, 'r') as f:
            raw_data = json.load(f)
            _reviews_cache = normalizer.normalize_batch(raw_data.get("reviews", []))
    
    return _reviews_cache


def _apply_filters(reviews: list[Review], filters: ReviewFilters) -> list[Review]:
    """Apply filters to review list"""
    filtered = reviews
    
    if filters.property_id:
        filtered = [r for r in filtered if r.property_id == filters.property_id]
    
    if filters.min_rating is not None:
        filtered = [r for r in filtered if r.rating >= filters.min_rating]
    
    if filters.max_rating is not None:
        filtered = [r for r in filtered if r.rating <= filters.max_rating]
    
    if filters.source:
        filtered = [r for r in filtered if r.source == filters.source]
    
    if filters.status:
        filtered = [r for r in filtered if r.status == filters.status]
    
    if filters.start_date:
        filtered = [r for r in filtered if r.date >= filters.start_date]
    
    if filters.end_date:
        filtered = [r for r in filtered if r.date <= filters.end_date]
    
    if filters.search:
        search_lower = filters.search.lower()
        filtered = [
            r for r in filtered
            if search_lower in r.comment.lower()
            or search_lower in r.guest_name.lower()
            or search_lower in r.property_name.lower()
        ]
    
    return filtered


@router.get("/reviews", response_model=list[Review])
async def get_reviews(
    property_id: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None, ge=1.0, le=5.0),
    max_rating: Optional[float] = Query(None, ge=1.0, le=5.0),
    source: Optional[ReviewSource] = Query(None),
    status: Optional[ReviewStatus] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: SortField = Query(SortField.DATE),
    sort_desc: bool = Query(True),
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """
    Get all reviews with optional filtering and sorting
    """
    reviews = _load_mock_data(normalizer)
    
    # Apply filters
    filters = ReviewFilters(
        property_id=property_id,
        min_rating=min_rating,
        max_rating=max_rating,
        source=source,
        status=status,
        search=search
    )
    filtered_reviews = _apply_filters(reviews, filters)
    
    # Apply sorting
    if sort_by == SortField.DATE:
        filtered_reviews.sort(key=lambda r: r.date, reverse=sort_desc)
    elif sort_by == SortField.RATING:
        filtered_reviews.sort(key=lambda r: r.rating, reverse=sort_desc)
    elif sort_by == SortField.PROPERTY:
        filtered_reviews.sort(key=lambda r: r.property_name, reverse=sort_desc)
    
    return filtered_reviews


@router.get("/reviews/{review_id}", response_model=Review)
async def get_review(
    review_id: str,
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """Get a single review by ID"""
    reviews = _load_mock_data(normalizer)
    review = next((r for r in reviews if r.id == review_id), None)
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return review


@router.patch("/reviews/{review_id}", response_model=Review)
async def update_review(
    review_id: str,
    update: ReviewUpdate,
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """Update review status (approve/reject)"""
    reviews = _load_mock_data(normalizer)
    review = next((r for r in reviews if r.id == review_id), None)
    
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.status = update.status
    if update.response:
        review.response = update.response
    
    from datetime import datetime
    review.updated_at = datetime.now()
    
    return review


@router.get("/stats/overall")
async def get_overall_stats(
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """Get overall dashboard statistics"""
    reviews = _load_mock_data(normalizer)
    return calculate_overall_stats(reviews)


@router.get("/stats/properties", response_model=list[PropertyStats])
async def get_property_stats(
    property_id: Optional[str] = Query(None),
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """Get statistics for all properties or a specific property"""
    reviews = _load_mock_data(normalizer)
    return calculate_property_stats(reviews, property_id=property_id)
