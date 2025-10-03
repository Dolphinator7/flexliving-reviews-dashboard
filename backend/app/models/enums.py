"""Shared enumerations"""
from enum import Enum


class ReviewSource(str, Enum):
    """Review source platforms"""
    HOSTAWAY = "hostaway"
    GOOGLE = "google"
    AIRBNB = "airbnb"
    BOOKING = "booking"


class ReviewStatus(str, Enum):
    """Review approval status"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SortField(str, Enum):
    """Available sort fields"""
    DATE = "date"
    RATING = "rating"
    PROPERTY = "property"
