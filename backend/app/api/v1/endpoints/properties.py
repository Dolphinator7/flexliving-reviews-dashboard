from fastapi import APIRouter, HTTPException
from app.models.property import Property
from app.models.review import Review
from pathlib import Path
import json
import statistics
from datetime import datetime

router = APIRouter(prefix="/properties", tags=["properties"])

# ✅ Load mock data
DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "mock_reviews.json"
with open(DATA_PATH, "r", encoding="utf-8") as f:
    REVIEWS = json.load(f)

# ✅ Mapping property slugs to names in mock data
PROPERTY_MAP = {
    "shoreditch-heights": "2B Shoreditch Heights",
    "kensington-garden": "Kensington Garden House",
    "central-london-loft": "Central London Loft",
    "tower-bridge-studio": "Tower Bridge Studio",
    "soho-modern-flat": "Soho Modern Flat",
    "city-center-apartment": "City Center Apartment",
    "riverside-cottage": "Riverside Cottage",
}

# ✅ Mock property info
MOCK_PROPERTIES = {
    "shoreditch-heights": {
        "id": "shoreditch-heights",
        "name": "2B Shoreditch Heights",
        "address": "Shoreditch High St",
        "city": "London",
        "image_url": "/images/shoreditch.jpg",
    },
    "kensington-garden": {
        "id": "kensington-garden",
        "name": "Kensington Garden House",
        "address": "Kensington Rd",
        "city": "London",
        "image_url": "/images/kensington.jpg",
    },
    "central-london-loft": {
        "id": "central-london-loft",
        "name": "Central London Loft",
        "address": "King St",
        "city": "London",
        "image_url": "/images/central.jpg",
    },
}


# ✅ Helper function to calculate stats
def calculate_property_stats(listing_name: str):
    reviews = [r for r in REVIEWS if r.get("listingName") == listing_name]
    if not reviews:
        return {"total_reviews": 0, "average_rating": 0, "rating_distribution": {i: 0 for i in range(1, 6)}}

    ratings = [int(r.get("rating", 0)) for r in reviews if r.get("rating") is not None]
    avg_rating = round(statistics.mean(ratings), 1)
    distribution = {i: ratings.count(i) for i in range(1, 6)}

    return {
        "total_reviews": len(ratings),
        "average_rating": avg_rating,
        "rating_distribution": distribution,
    }


# ✅ 1. Get all properties (with stats)
@router.get("/", response_model=list[Property])
def get_all_properties():
    properties = []
    for pid, prop in MOCK_PROPERTIES.items():
        listing_name = PROPERTY_MAP.get(pid)
        stats = calculate_property_stats(listing_name)
        properties.append({**prop, **stats})
    return properties


# ✅ 2. Get a single property (with stats)
@router.get("/{property_id}", response_model=Property)
def get_property(property_id: str):
    if property_id not in MOCK_PROPERTIES:
        raise HTTPException(status_code=404, detail="Property not found")

    listing_name = PROPERTY_MAP[property_id]
    stats = calculate_property_stats(listing_name)
    return {**MOCK_PROPERTIES[property_id], **stats}


# ✅ 3. Get property reviews
@router.get("/{property_id}/reviews", response_model=list[Review])
def get_property_reviews(property_id: str):
    if property_id not in PROPERTY_MAP:
        raise HTTPException(status_code=404, detail="Property not found")

    listing_name = PROPERTY_MAP[property_id]
    raw_reviews = [r for r in REVIEWS if r["listingName"] == listing_name]

    if not raw_reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this property")

    reviews = []
    for r in raw_reviews:
        reviews.append({
            "id": str(r.get("id", "")),
            "property_id": property_id,
            "property_name": r.get("listingName"),
            "guest_name": r.get("guestName"),
            "comment": r.get("publicReview") or "",
            "rating": r.get("rating", 0),
            "date": r.get("submittedAt") or datetime.utcnow().isoformat(),
            "status": "approved" if r.get("status") in ["published", "approved"] else "pending",
            "source": r.get("channel", "unknown").lower(),
        })

    return reviews


# ✅ 4. Get property stats only
@router.get("/{property_id}/stats")
def get_property_stats(property_id: str):
    if property_id not in PROPERTY_MAP:
        raise HTTPException(status_code=404, detail="Property not found")

    listing_name = PROPERTY_MAP[property_id]
    return calculate_property_stats(listing_name)

