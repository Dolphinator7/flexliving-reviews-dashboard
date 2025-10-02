"""Dependency injection for API endpoints"""
from app.core.normalizers.hostaway import HostawayNormalizer


def get_hostaway_normalizer() -> HostawayNormalizer:
    """Get Hostaway normalizer instance"""
    return HostawayNormalizer()
