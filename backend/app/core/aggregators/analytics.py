def calculate_review_analytics(reviews: list):
    if not reviews:
        return {
            "rating_distribution": [],
            "source_distribution": [],
            "sentiment": {},
        }

    # Rating distribution
    ratings = {}
    for r in reviews:
        rating = r.get("rating", 0) or 0
        ratings[rating] = ratings.get(rating, 0) + 1

    rating_distribution = [
        {"rating": k, "count": v}
        for k, v in sorted(ratings.items(), reverse=True)
    ]

    # Source breakdown (mock: channel if exists, else "Unknown")
    sources = {}
    for r in reviews:
        src = r.get("channel", "Unknown")
        sources[src] = sources.get(src, 0) + 1

    source_distribution = [
        {"source": k, "count": v} for k, v in sources.items()
    ]

    # Very simple sentiment placeholder
    sentiment = {
        "positive": sum(1 for r in reviews if "good" in r.get("publicReview", "").lower()),
        "negative": sum(1 for r in reviews if "bad" in r.get("publicReview", "").lower()),
        "neutral": 0,
    }

    return {
        "rating_distribution": rating_distribution,
        "source_distribution": source_distribution,
        "sentiment": sentiment,
    }
