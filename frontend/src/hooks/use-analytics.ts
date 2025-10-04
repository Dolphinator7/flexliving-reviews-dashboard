// src/hooks/use-analytics.ts
import { useState, useEffect } from "react"
import { API_URL } from "@/lib/constants"
import { AnalyticsData } from "@/types/analytics"

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_URL}/reviews/analytics`)
        const json = await res.json()

        // ✅ Normalize backend response into AnalyticsData shape
        const formattedData: AnalyticsData = {
          ratingDistribution: (json.ratingDistribution || []).map((item: any) => ({
            rating: item.rating ?? 0,
            count: item.count ?? 0,
            percentage: item.percentage ?? 0,
          })),
          sourceDistribution: (json.sourceDistribution || []).map((item: any) => ({
            source: item.source ?? "Unknown",
            count: item.count ?? 0,
          })),
          sentiment: (json.sentimentData || json.sentiment || []).map((item: any) => ({
            label: item.label ?? "Neutral",
            value: item.value ?? 0,
          })),
        }

        setData(formattedData)
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
