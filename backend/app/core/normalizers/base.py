"""Abstract base normalizer for review sources"""
from abc import ABC, abstractmethod
from typing import Any
from app.models.review import Review


class BaseNormalizer(ABC):
    """Abstract base class for review normalizers"""
    
    @abstractmethod
    def normalize(self, raw_data: dict[str, Any]) -> Review:
        """
        Normalize raw review data to standard Review model
        
        Args:
            raw_data: Raw review data from external source
            
        Returns:
            Normalized Review object
        """
        pass
    
    @abstractmethod
    def normalize_batch(self, raw_data_list: list[dict[str, Any]]) -> list[Review]:
        """
        Normalize multiple reviews at once
        
        Args:
            raw_data_list: List of raw review data
            
        Returns:
            List of normalized Review objects
        """
        pass
