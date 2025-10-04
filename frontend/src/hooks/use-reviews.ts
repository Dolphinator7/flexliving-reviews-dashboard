// src/hooks/use-reviews.ts
import { useEffect, useState } from "react"
import { API_URL } from "@/lib/constants"

export function useReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_URL}/reviews`)
        const json = await res.json()
        if (json.status === "success") {
          setReviews(json.result)
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  return { reviews, loading }
}

// ✅ Add this function (this was missing)
export function useOverallStats() {
  const { reviews, loading } = useReviews()

  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
      : "0.0"

  const recentReview = reviews.length > 0 ? reviews[0] : null

  return {
    stats: { totalReviews, avgRating, recentReview },
    isLoading: loading,
  }
}

