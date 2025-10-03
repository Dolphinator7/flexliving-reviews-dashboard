"""Hostaway integration endpoints"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from datetime import datetime, timedelta
from app.services.hostaway import HostawayClient, get_hostaway_client
from app.core.normalizers.hostaway import HostawayNormalizer
from app.api.deps import get_hostaway_normalizer
from app.models.review import Review

router = APIRouter()


@router.get("/hostaway/reviews", response_model=list[Review])
async def fetch_hostaway_reviews(
    property_id: Optional[str] = Query(None, description="Filter by property ID"),
    days_back: int = Query(30, ge=1, le=365, description="Number of days to fetch reviews"),
    limit: int = Query(100, ge=1, le=500, description="Maximum reviews to fetch"),
    client: HostawayClient = Depends(get_hostaway_client),
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """
    Fetch and normalize reviews from Hostaway API
    
    This endpoint:
    1. Fetches raw review data from Hostaway
    2. Normalizes it to our standard Review format
    3. Returns structured data ready for the dashboard
    
    Note: Currently uses mock data in sandbox mode
    """
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    # Fetch raw reviews from Hostaway
    raw_reviews = await client.get_reviews(
        property_id=property_id,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        limit=limit
    )
    
    if not raw_reviews:
        # Return empty list if no reviews found
        return []
    
    # Normalize to standard format
    normalized_reviews = normalizer.normalize_batch(raw_reviews)
    
    return normalized_reviews


@router.get("/hostaway/properties")
async def fetch_hostaway_properties(
    client: HostawayClient = Depends(get_hostaway_client)
):
    """
    Fetch properties from Hostaway API
    
    Returns raw property data from Hostaway for property selection
    """
    properties = await client.get_properties()
    
    if not properties:
        return []
    
    return properties


@router.post("/hostaway/sync")
async def sync_hostaway_data(
    property_id: Optional[str] = None,
    client: HostawayClient = Depends(get_hostaway_client),
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    """
    Sync reviews from Hostaway to local database
    
    This endpoint:
    1. Fetches latest reviews from Hostaway
    2. Normalizes them
    3. Stores/updates them in the database
    4. Returns sync statistics
    
    Note: Database integration pending
    """
    # Fetch reviews from last 90 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)
    
    raw_reviews = await client.get_reviews(
        property_id=property_id,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
        limit=500
    )
    
    normalized_reviews = normalizer.normalize_batch(raw_reviews)
    
    # TODO: Store in database
    # For now, return sync stats
    return {
        "synced_at": datetime.now().isoformat(),
        "total_fetched": len(raw_reviews),
        "total_normalized": len(normalized_reviews),
        "property_id": property_id,
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
    }
