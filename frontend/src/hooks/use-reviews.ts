import { useEffect, useState, useCallback } from "react"
import { API_URL } from "@/lib/constants"

export interface Review {
  id: number
  rating: number
  publicReview: string
  guestName: string
  listingName: string
  channel: string
  submittedAt: string
  is_approved?: boolean
  status?: string
}

export interface ReviewFilters {
  search?: string
  source?: string
  status?: string
  min_rating?: number
}

export function useReviews(filters: ReviewFilters = {}) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    try {
      // Construct query string dynamically from filters
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value))
        }
      })

      const res = await fetch(`${API_URL}/reviews?${params.toString()}`)
      const json = await res.json()

      // Automatically unwrap wrapper responses
      const data = json?.reviews || json?.result || json?.data || []
      setReviews(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch reviews", err)
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, isLoading, mutate: fetchReviews }
}

export async function patchReviewStatus(
  reviewId: number,
  status: "approved" | "rejected"
) {
  try {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.detail || "Failed to update review")
    return json
  } catch (err: any) {
    console.error("Failed to patch review:", err)
    throw err
  }
}

export function useOverallStats(filters: ReviewFilters = {}) {
  const { reviews, isLoading, mutate } = useReviews(filters)

  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
        ).toFixed(1)
      : "0.0"

  const recentReview = reviews.length > 0 ? reviews[0] : null

  return {
    stats: { totalReviews, avgRating, recentReview },
    isLoading,
    mutate,
  }
}

