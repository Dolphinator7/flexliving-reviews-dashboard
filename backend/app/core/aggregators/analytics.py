"""Analytics and aggregation functions"""
from collections import defaultdict
from typing import Optional
from app.models.review import Review, PropertyStats


def calculate_property_stats(
    reviews: list[Review],
    property_id: Optional[str] = None,
    limit_recent: int = 5
) -> list[PropertyStats]:
    """
    Calculate statistics for properties
    
    Args:
        reviews: List of reviews to analyze
        property_id: Optional property ID to filter by
        limit_recent: Number of recent reviews to include
        
    Returns:
        List of PropertyStats objects
    """
    # Group reviews by property
    property_reviews: dict[str, list[Review]] = defaultdict(list)
    for review in reviews:
        if property_id is None or review.property_id == property_id:
            property_reviews[review.property_id].append(review)
    
    stats_list = []
    for prop_id, prop_reviews in property_reviews.items():
        if not prop_reviews:
            continue
            
        # Calculate average rating
        total_rating = sum(r.rating for r in prop_reviews)
        avg_rating = round(total_rating / len(prop_reviews), 1)
        
        # Calculate rating distribution
        distribution = defaultdict(int)
        for review in prop_reviews:
            distribution[int(review.rating)] += 1
        
        # Get recent reviews (sorted by date)
        recent = sorted(prop_reviews, key=lambda r: r.date, reverse=True)[:limit_recent]
        
        stats_list.append(PropertyStats(
            property_id=prop_id,
            property_name=prop_reviews[0].property_name,
            total_reviews=len(prop_reviews),
            average_rating=avg_rating,
            rating_distribution=dict(distribution),
            recent_reviews=recent
        ))
    
    return stats_list


def calculate_overall_stats(reviews: list[Review]) -> dict:
    """Calculate overall dashboard statistics"""
    if not reviews:
        return {
            "total_reviews": 0,
            "average_rating": 0.0,
            "pending_reviews": 0,
            "approved_reviews": 0,
        }
    
    from app.models.enums import ReviewStatus
    
    total = len(reviews)
    avg_rating = round(sum(r.rating for r in reviews) / total, 1)
    pending = sum(1 for r in reviews if r.status == ReviewStatus.PENDING)
    approved = sum(1 for r in reviews if r.status == ReviewStatus.APPROVED)
    
    return {
        "total_reviews": total,
        "average_rating": avg_rating,
        "pending_reviews": pending,
        "approved_reviews": approved,
    }
