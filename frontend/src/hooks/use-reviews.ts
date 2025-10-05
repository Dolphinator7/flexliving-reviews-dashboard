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
        setReviews(json.result)
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

  // Fetch on mount
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
