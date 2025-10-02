"""Hostaway review normalizer"""
from datetime import datetime
from typing import Any
from app.models.review import Review
from app.models.enums import ReviewSource, ReviewStatus
from .base import BaseNormalizer


class HostawayNormalizer(BaseNormalizer):
    """Normalizer for Hostaway review data"""
    
    def normalize(self, raw_data: dict[str, Any]) -> Review:
        """
        Normalize Hostaway review to standard format
        
        Expected Hostaway format:
        {
            "id": "123",
            "listingId": "prop_456",
            "listingName": "Luxury Apartment",
            "guestName": "John Doe",
            "rating": 4.5,
            "review": "Great stay!",
            "createdAt": "2024-01-15T10:30:00Z",
            "channelName": "Airbnb"
        }
        """
        return Review(
            id=str(raw_data.get("id")),
            property_id=str(raw_data.get("listingId")),
            property_name=raw_data.get("listingName", "Unknown Property"),
            guest_name=raw_data.get("guestName", "Anonymous"),
            rating=float(raw_data.get("rating", 0)),
            comment=raw_data.get("review", ""),
            date=self._parse_date(raw_data.get("createdAt")),
            source=self._map_source(raw_data.get("channelName", "hostaway")),
            status=ReviewStatus.PENDING,
        )
    
    def normalize_batch(self, raw_data_list: list[dict[str, Any]]) -> list[Review]:
        """Normalize multiple Hostaway reviews"""
        return [self.normalize(data) for data in raw_data_list]
    
    def _parse_date(self, date_str: str | None) -> datetime:
        """Parse date string to datetime"""
        if not date_str:
            return datetime.now()
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            return datetime.now()
    
    def _map_source(self, channel_name: str) -> ReviewSource:
        """Map Hostaway channel name to ReviewSource enum"""
        channel_map = {
            "airbnb": ReviewSource.AIRBNB,
            "booking": ReviewSource.BOOKING,
            "booking.com": ReviewSource.BOOKING,
        }
        return channel_map.get(channel_name.lower(), ReviewSource.HOSTAWAY)
