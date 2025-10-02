"""Database session management (prepared for SQLAlchemy)"""
from typing import Generator


class SessionLocal:
    """
    Placeholder for SQLAlchemy session
    
    When migrating to a real database, replace with:
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    """
    pass


def get_db() -> Generator:
    """
    Dependency for getting database session
    
    When migrating to a real database, implement as:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    """
    yield None
