import { useState, useEffect } from "react"
import { API_URL } from "@/lib/constants"

export function useAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_URL}/reviews/analytics`)
        const json = await res.json()

        // directly accept data since backend returns valid JSON
        setData({
          ratingDistribution: json.ratingDistribution || [],
          sourceDistribution: json.sourceDistribution || [],
          sentiment: json.sentimentData || json.sentiment || [],
        })
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  return { data, loading }
}
