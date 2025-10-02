from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    API_PREFIX: str = "/api/v1"
    HOSTAWAY_API_BASE: str = "https://api.hostaway.com"
    HOSTAWAY_API_KEY: str | None = None
    HOSTAWAY_USE_MOCK: bool = True
    BACKEND_CORS_ORIGINS: List[str] = []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    # Custom parsing after init
    def __init__(self, **values):
        super().__init__(**values)
        # If BACKEND_CORS_ORIGINS is a string from .env, split by comma
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            self.BACKEND_CORS_ORIGINS = [x.strip() for x in self.BACKEND_CORS_ORIGINS.split(",") if x.strip()]

def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
