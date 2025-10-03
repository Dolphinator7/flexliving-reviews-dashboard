"""Hostaway API client for fetching reviews"""
import httpx
from typing import List, Dict, Any, Optional
from app.config import get_settings

settings = get_settings()


class HostawayClient:
    """Client for interacting with Hostaway API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.HOSTAWAY_API_KEY
        self.base_url = "https://api.hostaway.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def get_reviews(
        self,
        property_id: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Fetch reviews from Hostaway API
        
        Args:
            property_id: Filter by specific property
            start_date: Start date for review range (ISO format)
            end_date: End date for review range (ISO format)
            limit: Maximum number of reviews to fetch
            
        Returns:
            List of raw review data from Hostaway
        """
        params = {"limit": limit}
        if property_id:
            params["listingId"] = property_id
        if start_date:
            params["startDate"] = start_date
        if end_date:
            params["endDate"] = end_date
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/reviews",
                    headers=self.headers,
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("result", [])
            except httpx.HTTPError as e:
                # Log error and return empty list for demo purposes
                print(f"Error fetching Hostaway reviews: {e}")
                return []
    
    async def get_properties(self) -> List[Dict[str, Any]]:
        """
        Fetch properties from Hostaway API
        
        Returns:
            List of property data from Hostaway
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/listings",
                    headers=self.headers,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("result", [])
            except httpx.HTTPError as e:
                print(f"Error fetching Hostaway properties: {e}")
                return []


def get_hostaway_client() -> HostawayClient:
    """Dependency for getting Hostaway client"""
    return HostawayClient()
