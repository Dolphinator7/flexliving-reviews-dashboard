import httpx
from app.config import get_settings

settings = get_settings()

class HostawayClient:
    def __init__(self):
        self.base_url = settings.HOSTAWAY_API_BASE
        self.api_key = settings.HOSTAWAY_API_KEY
        self.account_id = settings.HOSTAWAY_ACCOUNT_ID

        if not self.api_key:
            raise ValueError("Missing Hostaway API key")

    async def get_reviews(self):
        url = f"{self.base_url}/v1/reviews?accountId={self.account_id}"
        headers = {"Authorization": f"Bearer {self.api_key}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()

    async def get_property(self, property_id: int):
        url = f"{self.base_url}/v1/listings/{property_id}?accountId={self.account_id}"
        headers = {"Authorization": f"Bearer {self.api_key}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
