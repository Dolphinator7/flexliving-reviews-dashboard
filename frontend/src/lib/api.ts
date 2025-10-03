import { API_URL } from "./constants"

// Generic fetcher for SWR
export const fetcher = (url: string) =>
  fetch(`${API_URL}${url}`).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  })

// Reviews API wrapper
export const reviewsAPI = {
  async list(propertyId?: string) {
    const query = propertyId ? `?propertyId=${propertyId}` : ""
    const res = await fetch(`${API_URL}/reviews${query}`)
    if (!res.ok) throw new Error("Failed to fetch reviews")
    return res.json()
  },

  async stats(propertyId: string) {
    const res = await fetch(`${API_URL}/reviews/stats?propertyId=${propertyId}`)
    if (!res.ok) throw new Error("Failed to fetch review stats")
    return res.json()
  },
}

export const analyticsAPI = {
  async fetchAnalytics() {
    const res = await fetch(`${API_URL}/reviews/analytics`)
    if (!res.ok) throw new Error("Failed to fetch analytics")
    return res.json()
  },
}
