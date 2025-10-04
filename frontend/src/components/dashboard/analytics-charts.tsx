"use client"

import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Star,
  ThumbsUp,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import { SOURCE_STYLES } from "@/lib/constants"
import { RatingDistributionItem } from "@/types/analytics"

export function AnalyticsCharts() {
  const { data, loading } = useAnalytics()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-200">
        Loading analytics...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-400">
        Failed to load analytics
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12 space-y-10 rounded-xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 border rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 border-primary/30">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
            Analytics Overview
          </h3>
          <p className="text-sm text-gray-300">
            Deep insights into your review performance
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card className="relative overflow-hidden border shadow-lg bg-gray-800/70 border-yellow-500/20 shadow-yellow-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-60" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-lg bg-yellow-500/10 border-yellow-500/30">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Rating Distribution</h4>
                  <p className="text-xs text-gray-300">Breakdown by stars</p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>

            <div className="space-y-3">
              {data.ratingDistribution.map((item: RatingDistributionItem) => (
  <div key={item.rating} className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-gray-200">
          {item.rating} Star
        </span>
      </div>
      <span className="text-gray-400">{item.count}</span>
    </div>
    <div className="h-2 overflow-hidden bg-gray-700 rounded-full">
      <div
        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
        style={{ width: `${item.percentage}%` }}
      />
    </div>
  </div>
))}

            </div>
          </div>
        </Card>

        {/* Review Sources */}
        <Card className="relative overflow-hidden border shadow-lg bg-gray-800/70 border-cyan-500/20 shadow-cyan-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-60" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border rounded-lg bg-cyan-500/10 border-cyan-500/30">
                  <PieChart className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Review Sources</h4>
                  <p className="text-xs text-gray-300">Platform breakdown</p>
                </div>
              </div>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-3">
              {data.sourceDistribution.map((item) => {
                const key = item.source?.toLowerCase() || "unknown"
                const styles = SOURCE_STYLES[key] || SOURCE_STYLES.unknown

                return (
                  <div key={item.source} className="flex items-center gap-3">
                    <div className="text-2xl">{styles.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-200">
                          {item.source || "Unknown"}
                        </span>
                        <span className="text-sm text-gray-400">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden bg-gray-700 rounded-full">
                        <div
                          className={`h-full bg-gradient-to-r ${styles.color} rounded-full`}
                          style={{ width: `${item.count}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="relative overflow-hidden border shadow-lg bg-gray-800/70 border-green-500/20 shadow-green-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-rose-500/10 opacity-60" />
          <div className="relative p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-lg bg-green-500/10 border-green-500/30">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Sentiment Analysis</h4>
                <p className="text-xs text-gray-300">Review sentiment</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.sentiment.map((item) => {
                const Icon =
                  item.label === "Positive"
                    ? ThumbsUp
                    : item.label === "Negative"
                    ? AlertCircle
                    : Activity

                const color =
                  item.label === "Positive"
                    ? "from-green-400 to-emerald-500"
                    : item.label === "Negative"
                    ? "from-red-400 to-rose-500"
                    : "from-yellow-400 to-amber-500"

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-200">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden bg-gray-700 rounded-full">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
