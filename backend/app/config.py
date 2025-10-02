from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str  # will come from Railway env
    API_PREFIX: str = "/api/v1"
    HOSTAWAY_API_BASE: str = "https://api.hostaway.com"
    HOSTAWAY_API_KEY: str | None = None
    HOSTAWAY_USE_MOCK: bool = True
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://*.railway.app"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

def get_settings() -> "Settings":
    return Settings()

settings = get_settings()
