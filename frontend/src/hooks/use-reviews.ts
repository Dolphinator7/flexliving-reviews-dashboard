// src/hooks/use-reviews.ts
import { useEffect, useState, useCallback } from "react"
import { API_URL } from "@/lib/constants"

interface Review {
  id: number
  rating: number
  publicReview: string
  guestName: string
  listingName: string
  channel: string
  submittedAt: string
  status?: string
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/reviews`)
      const json = await res.json()

      if (json.status === "success" && Array.isArray(json.result)) {
        // ✅ Map backend snake_case fields to frontend camelCase
        const mappedReviews: Review[] = json.result.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          publicReview: r.publicReview,
          guestName: r.guest_name,
          listingName: r.listing_name,
          channel: r.type,
          submittedAt: r.date,
          status: r.status,
        }))
        setReviews(mappedReviews)
      } else {
        setReviews([])
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err)
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, isLoading, mutate: fetchReviews }
}

export function useOverallStats() {
  const { reviews, isLoading, mutate } = useReviews()

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
