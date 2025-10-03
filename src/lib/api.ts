import type { Review, ReviewFilters, PropertyStats, OverallStats } from "@/types/review"
import type { Property } from "@/types/property"
import type { ReviewStatus, SortField } from "@/types/review"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(errorData.detail || `API Error: ${response.statusText}`, response.status, errorData)
    }

    return response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError("Network error", 0, error)
  }
}

export const reviewsAPI = {
  async getReviews(
    filters?: ReviewFilters & {
      sort_by?: SortField
      sort_desc?: boolean
    },
  ): Promise<Review[]> {
    const params = new URLSearchParams()

    if (filters?.property_id) params.append("property_id", filters.property_id)
    if (filters?.min_rating) params.append("min_rating", filters.min_rating.toString())
    if (filters?.max_rating) params.append("max_rating", filters.max_rating.toString())
    if (filters?.source) params.append("source", filters.source)
    if (filters?.status) params.append("status", filters.status)
    if (filters?.search) params.append("search", filters.search)
    if (filters?.sort_by) params.append("sort_by", filters.sort_by)
    if (filters?.sort_desc !== undefined) params.append("sort_desc", filters.sort_desc.toString())

    const query = params.toString()
    return fetchAPI<Review[]>(`/reviews${query ? `?${query}` : ""}`)
  },

  async getReview(id: string): Promise<Review> {
    return fetchAPI<Review>(`/reviews/${id}`)
  },

  async updateReview(id: string, data: { status: ReviewStatus; response?: string }): Promise<Review> {
    return fetchAPI<Review>(`/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  async getOverallStats(): Promise<OverallStats> {
    return fetchAPI<OverallStats>("/stats/overall")
  },

  async getPropertyStats(propertyId?: string): Promise<PropertyStats[]> {
    const params = propertyId ? `?property_id=${propertyId}` : ""
    return fetchAPI<PropertyStats[]>(`/stats/properties${params}`)
  },
}

export const propertiesAPI = {
  async getProperties(): Promise<Property[]> {
    return fetchAPI<Property[]>("/properties")
  },

  async getProperty(id: string): Promise<Property> {
    return fetchAPI<Property>(`/properties/${id}`)
  },
}
