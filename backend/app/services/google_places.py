"""Google Places API client for fetching Google Reviews"""
import httpx
from typing import List, Dict, Any, Optional
from app.config import get_settings

settings = get_settings()


class GooglePlacesClient:
    """Client for interacting with Google Places API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GOOGLE_PLACES_API_KEY
        self.base_url = "https://maps.googleapis.com/maps/api/place"
    
    async def get_place_reviews(
        self,
        place_id: str,
        language: str = "en"
    ) -> List[Dict[str, Any]]:
        """
        Fetch reviews for a Google Place
        
        Args:
            place_id: Google Place ID
            language: Language code for reviews
            
        Returns:
            List of review data from Google Places
        """
        params = {
            "place_id": place_id,
            "fields": "reviews,rating,user_ratings_total",
            "key": self.api_key,
            "language": language
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/details/json",
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") == "OK":
                    result = data.get("result", {})
                    return result.get("reviews", [])
                return []
            except httpx.HTTPError as e:
                print(f"Error fetching Google reviews: {e}")
                return []
    
    async def search_place(
        self,
        query: str,
        location: Optional[str] = None
    ) -> Optional[str]:
        """
        Search for a place and return its place_id
        
        Args:
            query: Search query (e.g., property name and address)
            location: Optional location bias (lat,lng)
            
        Returns:
            Google Place ID if found, None otherwise
        """
        params = {
            "query": query,
            "key": self.api_key
        }
        if location:
            params["location"] = location
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/textsearch/json",
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") == "OK" and data.get("results"):
                    return data["results"][0].get("place_id")
                return None
            except httpx.HTTPError as e:
                print(f"Error searching Google Places: {e}")
                return None


def get_google_places_client() -> GooglePlacesClient:
    """Dependency for getting Google Places client"""
    return GooglePlacesClient()
