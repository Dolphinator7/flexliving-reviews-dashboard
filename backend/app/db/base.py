"""Base database model (prepared for SQLAlchemy)"""
from typing import Any
from datetime import datetime


class Base:
    """
    Base class for database models
    
    This is a placeholder for SQLAlchemy Base.
    When migrating to a real database, replace with:
    from sqlalchemy.ext.declarative import declarative_base
    Base = declarative_base()
    """
    id: Any
    created_at: datetime
    updated_at: datetime
