import requests
import json
import os
from app.config import settings

class HostawayClient:
    def __init__(self):
        self.base_url = settings.HOSTAWAY_API_BASE
        self.api_key = settings.HOSTAWAY_API_KEY
        self.account_id = settings.HOSTAWAY_ACCOUNT_ID

    def get_reviews(self):
        url = f"{self.base_url}/v1/reviews"
        headers = {
            "Content-Type": "application/json",
            "X-ACCOUNT-ID": str(self.account_id),
            "X-API-KEY": self.api_key,
        }

        try:
            resp = requests.get(url, headers=headers, timeout=10)

            # ✅ If live API works
            if resp.status_code == 200:
                return resp.json().get("result", [])

            # ❌ If sandbox rejects
            print(f"Hostaway API failed with {resp.status_code}, using mock data.")
            return self._load_mock_reviews()

        except Exception as e:
            print(f"Error fetching Hostaway reviews: {e}")
            return self._load_mock_reviews()

    def _load_mock_reviews(self):
        mock_path = os.path.join(os.path.dirname(__file__), "../../data/mock_reviews.json")
        with open(mock_path, "r", encoding="utf-8") as f:
            return json.load(f)
