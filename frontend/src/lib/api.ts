import { API_URL } from "./constants"

// Generic fetcher for SWR
export const fetcher = (url: string) =>
  fetch(`${API_URL}${url}`).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  })

// -------------------------------
// Reviews API (global)
// -------------------------------
export const reviewsAPI = {
  async list() {
    // ✅ Backend route: /api/v1/reviews
    const res = await fetch(`${API_URL}/reviews`)
    if (!res.ok) throw new Error("Failed to fetch reviews")
    return res.json()
  },
}

// -------------------------------
// Properties API
// -------------------------------
export const propertiesAPI = {
  async getProperty(slug: string) {
    // ✅ /api/v1/properties/{property_id}
    const res = await fetch(`${API_URL}/properties/${slug}`)
    if (!res.ok) throw new Error("Failed to fetch property")
    return res.json()
  },

  async getReviews(slug: string) {
    // ✅ /api/v1/properties/{property_id}/reviews
    const res = await fetch(`${API_URL}/properties/${slug}/reviews`)
    if (!res.ok) throw new Error("Failed to fetch property reviews")
    return res.json()
  },

  async getStats(slug: string) {
    // ✅ /api/v1/properties/{property_id}/stats
    const res = await fetch(`${API_URL}/properties/${slug}/stats`)
    if (!res.ok) throw new Error("Failed to fetch property stats")
    return res.json()
  },
}

// -------------------------------
// Analytics API (global)
// -------------------------------
export const analyticsAPI = {
  async fetchAnalytics() {
    // ✅ /api/v1/reviews/analytics
    const res = await fetch(`${API_URL}/reviews/analytics`)
    if (!res.ok) throw new Error("Failed to fetch analytics")
    return res.json()
  },
}
