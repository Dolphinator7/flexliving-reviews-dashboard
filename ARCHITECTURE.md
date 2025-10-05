# System Architecture

## Overview

The Flex Living Reviews Dashboard is a full-stack application designed to normalize, manage, and display property reviews from multiple sources. The system follows a clean architecture pattern with clear separation between the frontend, backend, and data layers.

## High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  Manager         │           │  Property        │       │
│  │  Dashboard       │           │  Detail Page     │       │
│  │  (Dark Theme)    │           │  (Light Theme)   │       │
│  └────────┬─────────┘           └────────┬─────────┘       │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                  │
│                    ┌─────▼─────┐                           │
│                    │  API      │                           │
│                    │  Client   │                           │
│                    │  (SWR)    │                           │
│                    └─────┬─────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Layer (v1)                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │   Reviews    │  │  Properties  │  │   Stats   │ │  │
│  │  │  Endpoints   │  │  Endpoints   │  │ Endpoints │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │  │
│  └─────────┼──────────────────┼─────────────────┼───────┘  │
│            │                  │                 │           │
│  ┌─────────▼──────────────────▼─────────────────▼───────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │ Normalizers  │  │ Aggregators  │  │  Filters  │  │  │
│  │  │  (Hostaway,  │  │  (Analytics, │  │  (Query   │  │  │
│  │  │   Google)    │  │   Stats)     │  │  Builder) │  │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data Layer                               │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │  Pydantic    │  │  In-Memory   │                  │  │
│  │  │  Models      │  │  Cache       │                  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ External APIs
┌──────────────────────────▼──────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Hostaway   │  │    Google    │  │   Booking    │      │
│  │     API      │  │   Places     │  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
\`\`\`

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Data Fetching**: SWR (stale-while-revalidate)
- **Date Handling**: date-fns

### Key Design Patterns

#### 1. Server Components by Default
- Pages are React Server Components for optimal performance
- Client components marked with "use client" directive
- Minimizes JavaScript bundle size

#### 2. Custom Hooks for Data Fetching
\`\`\`typescript
// Encapsulates SWR logic and API calls
useReviews(filters) → { reviews, isLoading, mutate }
useProperty(id) → { property, isLoading }
\`\`\`

#### 3. Component Composition
- **UI Components**: Reusable primitives (Button, Card, Table)
- **Feature Components**: Domain-specific (ReviewsTable, StatsCards)
- **Page Components**: Compose features into full pages

#### 4. Type Safety
- Shared TypeScript types between frontend and backend
- Runtime validation with Zod (if needed)
- Compile-time type checking

### Routing Structure
\`\`\`
/                          → Manager Dashboard (dark theme)
/property/[id]             → Property Detail Page (light theme)
\`\`\`

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Validation**: Pydantic v2
- **HTTP Client**: httpx (async)
- **Testing**: pytest

### Key Design Patterns

#### 1. Normalizer Pattern
Abstract base class for converting external review formats to internal standard:

\`\`\`python
class BaseNormalizer(ABC):
    @abstractmethod
    def normalize(self, raw_data: dict) -> Review:
        pass
    
    @abstractmethod
    def normalize_batch(self, raw_data_list: list) -> list[Review]:
        pass
\`\`\`

**Benefits**:
- Easy to add new review sources
- Consistent internal data model
- Testable in isolation

#### 2. Repository Pattern (Future)
Currently using in-memory cache, but structured for easy database integration:

\`\`\`python
class ReviewRepository:
    def get_all(self, filters: ReviewFilters) -> list[Review]
    def get_by_id(self, id: str) -> Review
    def update(self, id: str, data: ReviewUpdate) -> Review
\`\`\`

#### 3. Dependency Injection
FastAPI's dependency system for clean, testable code:

\`\`\`python
def get_hostaway_normalizer() -> HostawayNormalizer:
    return HostawayNormalizer()

@router.get("/reviews")
async def get_reviews(
    normalizer: HostawayNormalizer = Depends(get_hostaway_normalizer)
):
    ...
\`\`\`

#### 4. API Versioning
All endpoints under `/api/v1/` for future compatibility

### Data Flow

1. **Ingestion**: External API → Normalizer → Standard Review Model
2. **Storage**: In-memory cache (future: database)
3. **Retrieval**: Filters applied → Sorting → Response
4. **Update**: Status change → Cache update → Response

## Data Models

### Core Models

#### Review
\`\`\`typescript
{
  id: string
  property_id: string
  property_name: string
  guest_name: string
  rating: number (1-5)
  comment: string
  date: datetime
  source: ReviewSource (hostaway|google|airbnb|booking)
  status: ReviewStatus (pending|approved|rejected)
  response?: string
  created_at: datetime
  updated_at: datetime
}
\`\`\`

#### Property
\`\`\`typescript
{
  id: string
  name: string
  address: string
  city: string
  image_url: string
  total_reviews: number
  average_rating: number
}
\`\`\`

#### PropertyStats
\`\`\`typescript
{
  property_id: string
  property_name: string
  total_reviews: number
  average_rating: number
  rating_distribution: Record<number, number>
  recent_reviews: Review[]
}
\`\`\`

## Security Considerations

### Current Implementation
- CORS configured for localhost development
- Input validation via Pydantic models
- Type safety throughout

### Production Recommendations
1. **Authentication**: Add JWT-based auth for manager dashboard
2. **Rate Limiting**: Implement rate limiting on API endpoints
3. **HTTPS**: Enforce HTTPS in production
4. **API Keys**: Secure external API keys in environment variables
5. **Row-Level Security**: If using database, implement RLS

## Scalability Considerations

### Current Limitations
- In-memory storage (not persistent)
- Single-server deployment
- No caching layer

### Future Improvements
1. **Database**: PostgreSQL with connection pooling
2. **Caching**: Redis for frequently accessed data
3. **CDN**: Static assets and images
4. **Load Balancing**: Multiple backend instances
5. **Background Jobs**: Queue system for async processing

## Testing Strategy

### Frontend
- Component tests with React Testing Library
- E2E tests with Playwright
- Type checking with TypeScript

### Backend
- Unit tests for normalizers and aggregators
- Integration tests for API endpoints
- Mock external API calls

## Deployment Architecture

### Recommended Setup

\`\`\`
┌─────────────────────────────────────────────┐
│              Vercel (Frontend)              │
│  - Next.js App                              │
│  - Edge Functions                           │
│  - CDN                                      │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTPS
                 │
┌────────────────▼────────────────────────────┐
│         Backend (Railway/Render)            │
│  - FastAPI App                              │
│  - Gunicorn + Uvicorn workers              │
└────────────────┬────────────────────────────┘
                 │
                 │
┌────────────────▼────────────────────────────┐
│         Database (Neon/Supabase)            │
│  - PostgreSQL                               │
│  - Connection pooling                       │
└─────────────────────────────────────────────┘
\`\`\`

## Monitoring and Observability

### Recommended Tools
- **Frontend**: Vercel Analytics, Sentry
- **Backend**: FastAPI built-in metrics, Sentry
- **Logs**: Structured logging with correlation IDs
- **Metrics**: Response times, error rates, cache hit rates

## Future Enhancements

1. **Real-time Updates**: WebSocket for live review updates
2. **Email Notifications**: Alert managers of new reviews
3. **Sentiment Analysis**: AI-powered review sentiment scoring
4. **Multi-language**: Support for international reviews
5. **Review Responses**: Allow managers to respond to reviews
6. **Bulk Actions**: Approve/reject multiple reviews at once
7. **Export**: CSV/PDF export of reviews and analytics
\`\`\`

This architecture provides a solid foundation for a production-ready review management system.
