# backend/app/api/v1/endpoints/reviews.py
from fastapi import APIRouter, HTTPException
import json
from pathlib import Path
from collections import Counter
import re

router = APIRouter()

def normalize_source(raw: str) -> str:
    if not raw:
        return "unknown"
    s = str(raw).lower()
    s_clean = re.sub(r"[^a-z0-9]+", "", s)
    if "airbnb" in s_clean:
        return "airbnb"
    if "booking" in s_clean or "bookingcom" in s_clean:
        return "booking"
    if "google" in s_clean:
        return "google"
    if "hostaway" in s_clean:
        return "hostaway"
    if "manual" in s_clean:
        return "manual"
    return "unknown"

def load_mock_reviews():
    mock_path = Path(__file__).resolve().parents[3] / "data" / "mock_reviews.json"
    with open(mock_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for r in data:
        raw = r.get("channel") or r.get("source") or ""
        r["source"] = normalize_source(raw)
    return data

@router.get("/", summary="Get all reviews")
async def get_reviews():
    try:
        reviews = load_mock_reviews()
        return {"status": "success", "result": reviews}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics", summary="Get review analytics")
async def get_review_analytics():
    try:
        reviews = load_mock_reviews()
        total = len(reviews)
        if total == 0:
            return {"status": "success", "ratingDistribution": [], "sourceDistribution": [], "sentiment": []}

        rating_counts = Counter(r.get("rating", 0) for r in reviews)
        rating_distribution = [
            {"rating": k, "count": v, "percentage": round((v / total) * 100, 1)}
            for k, v in sorted(rating_counts.items(), reverse=True)
        ]

        source_counts = Counter(r.get("source", "unknown") for r in reviews)
        source_distribution = [{"source": k, "count": v} for k, v in source_counts.items()]

        positive = sum(1 for r in reviews if (r.get("rating") or 0) >= 4)
        neutral = sum(1 for r in reviews if (r.get("rating") or 0) == 3)
        negative = sum(1 for r in reviews if (r.get("rating") or 0) <= 2)

        sentiment = [
            {"label": "Positive", "value": round((positive / total) * 100, 1)},
            {"label": "Neutral", "value": round((neutral / total) * 100, 1)},
            {"label": "Negative", "value": round((negative / total) * 100, 1)},
        ]

        return {
            "status": "success",
            "ratingDistribution": rating_distribution,
            "sourceDistribution": source_distribution,
            "sentiment": sentiment,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/stats")
def get_global_stats():
    reviews = load_mock_reviews()
    if not reviews:
        return {"total_reviews": 0, "average_rating": 0}
    ratings = [r["rating"] for r in reviews]
    return {
        "total_reviews": len(ratings),
        "average_rating": round(sum(ratings) / len(ratings), 1)
    }
