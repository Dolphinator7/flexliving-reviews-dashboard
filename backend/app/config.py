from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    API_PREFIX: str = "/api/v1"

    # Hostaway
    HOSTAWAY_API_BASE: str = "https://api.hostaway.com/v1"
    HOSTAWAY_ACCOUNT_ID: int | None = 61148
    HOSTAWAY_API_KEY: str | None = None
    HOSTAWAY_USE_MOCK: bool = True

    # CORS
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = []

    VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def __init__(self, **values):
        super().__init__(**values)
        # Normalize BACKEND_CORS_ORIGINS into a list
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            if self.BACKEND_CORS_ORIGINS.strip():
                self.BACKEND_CORS_ORIGINS = [
                    x.strip() for x in self.BACKEND_CORS_ORIGINS.split(",")
                ]
            else:
                self.BACKEND_CORS_ORIGINS = []


# Singleton settings instance
settings = Settings()


def get_settings() -> Settings:
    return settings
