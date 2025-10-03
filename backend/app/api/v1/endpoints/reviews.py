from fastapi import APIRouter, HTTPException
from app.services.hostaway import HostawayClient

router = APIRouter()
client = HostawayClient()

@router.get("/reviews")
async def get_reviews():
    try:
        data = await client.get_reviews()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews/analytics")
async def get_reviews_analytics():
    try:
        reviews_data = await client.get_reviews()

        reviews = reviews_data.get("result", [])
        if not reviews:
            return {"average_rating": 0, "total_reviews": 0, "distribution": {}}

        total_reviews = len(reviews)
        ratings = [r.get("rating") for r in reviews if r.get("rating")]

        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        distribution = {}
        for r in ratings:
            distribution[str(r)] = distribution.get(str(r), 0) + 1

        return {
            "average_rating": round(avg_rating, 2),
            "total_reviews": total_reviews,
            "distribution": distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
