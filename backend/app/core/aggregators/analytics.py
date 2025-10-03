from typing import List, Dict, Any
import statistics
from app.models.review import Review

def compute_property_stats(reviews: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compute analytics stats from a list of reviews.
    Each review is expected to contain:
      - "rating" (int or float)
      - "reviewCategory" (list of { category, rating })
    """

    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "categories": {}
        }

    ratings = [r["rating"] for r in reviews if r.get("rating") is not None]

    categories: Dict[str, list] = {}
    for r in reviews:
        for c in r.get("reviewCategory", []):
            cat = c["category"]
            categories.setdefault(cat, []).append(c["rating"])

    return {
        "average_rating": round(statistics.mean(ratings), 2) if ratings else 0,
        "total_reviews": len(reviews),
        "categories": {
            cat: round(statistics.mean(vals), 2) for cat, vals in categories.items()
        },
    }

def get_review_analytics(reviews: List[Review]) -> Dict[str, any]:
    """
    Generate analytics summary for a list of reviews.
    Example: average rating, total reviews, sentiment counts, etc.
    """
    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "distribution": {},
        }

    total_reviews = len(reviews)
    ratings = [r.rating for r in reviews if r.rating is not None]

    avg_rating = sum(ratings) / len(ratings) if ratings else 0

    # Distribution by rating (1–5)
    distribution: Dict[int, int] = {}
    for r in ratings:
        distribution[r] = distribution.get(r, 0) + 1

    return {
        "average_rating": round(avg_rating, 2),
        "total_reviews": total_reviews,
        "distribution": distribution,
    }