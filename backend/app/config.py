from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"  # default local
    API_PREFIX: str = "/api/v1"
    HOSTAWAY_API_BASE: str = "https://api.hostaway.com"
    HOSTAWAY_API_KEY: str | None = None
    HOSTAWAY_USE_MOCK: bool = True
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://*.railway.app"]

    class Config:
        env_file = ".env"

settings = Settings()
