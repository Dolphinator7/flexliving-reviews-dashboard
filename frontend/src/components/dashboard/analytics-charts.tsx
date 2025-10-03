"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, PieChart, Activity, Target, Star, ThumbsUp, AlertCircle, BarChart3 } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

export function AnalyticsCharts() {
  const { analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return <p className="text-muted-foreground">Loading analytics...</p>
  }

  if (!analytics) {
    return <p className="text-destructive">Failed to load analytics</p>
  }

  const { rating_distribution, source_distribution, sentiment } = analytics

  const sentimentData = [
    { label: "Positive", value: sentiment.positive, color: "bg-success", icon: ThumbsUp },
    { label: "Neutral", value: sentiment.neutral, color: "bg-warning", icon: Activity },
    { label: "Negative", value: sentiment.negative, color: "bg-destructive", icon: AlertCircle },
  ]

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl glass-card border-primary/30">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">Analytics Overview</h3>
          <p className="text-sm text-muted-foreground">Deep insights into your review performance</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Rating Distribution Chart */}
        <Card className="glass-card glass-card-hover gradient-border p-6 space-y-4">
          <h4 className="font-semibold">Rating Distribution</h4>
          <div className="space-y-3">
            {rating_distribution.map((item: any) => (
              <div key={item.rating}>
                <div className="flex justify-between text-sm">
                  <span>{item.rating} Stars</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Source Distribution */}
        <Card className="glass-card glass-card-hover gradient-border p-6 space-y-4">
          <h4 className="font-semibold">Review Sources</h4>
          <div className="space-y-3">
            {source_distribution.map((item: any) => (
              <div key={item.source} className="flex justify-between">
                <span>{item.source}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sentiment */}
        <Card className="glass-card glass-card-hover gradient-border p-6 space-y-4">
          <h4 className="font-semibold">Sentiment Analysis</h4>
          <div className="space-y-3">
            {sentimentData.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label}>
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
