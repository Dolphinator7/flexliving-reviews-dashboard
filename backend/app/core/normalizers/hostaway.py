def normalize_hostaway_review(item: dict) -> dict:
    return {
        "id": item.get("id"),
        "listing_name": item.get("listingName"),
        "guest_name": item.get("guestName"),
        "rating": item.get("rating"),
        "public_review": item.get("publicReview"),
        "categories": item.get("reviewCategory", []),
        "submitted_at": item.get("submittedAt")
    }

def normalize_hostaway_response(data: dict) -> list:
    items = data.get("result", [])
    return [normalize_hostaway_review(item) for item in items]
