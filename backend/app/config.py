from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    API_PREFIX: str = "/api/v1"
    HOSTAWAY_API_BASE: str = "https://api.hostaway.com"
    HOSTAWAY_API_KEY: str | None = None
    HOSTAWAY_USE_MOCK: bool = True
    # Temporarily accept string from env
    BACKEND_CORS_ORIGINS: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origins_list(self) -> List[str]:
        """Return CORS origins as a list."""
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
