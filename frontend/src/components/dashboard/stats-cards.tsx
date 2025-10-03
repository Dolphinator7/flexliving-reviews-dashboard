"use client"

import { Card } from "@/components/ui/card"
import { Star, MessageSquare, Clock, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { useOverallStats } from "@/hooks/use-reviews"

export function StatsCards() {
  const { stats, isLoading } = useOverallStats()

  const cards = [
    {
      title: "Total Reviews",
      value: stats?.total_reviews ?? 0,
      icon: MessageSquare,
      gradient: "from-cyan-500/20 via-blue-500/20 to-cyan-500/20",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Average Rating",
      value: stats?.average_rating?.toFixed(1) ?? "0.0",
      icon: Star,
      gradient: "from-yellow-500/20 via-orange-500/20 to-yellow-500/20",
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
      trend: "+0.3",
      trendUp: true,
    },
    {
      title: "Pending Review",
      value: stats?.pending_reviews ?? 0,
      icon: Clock,
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Approved",
      value: stats?.approved_reviews ?? 0,
      icon: CheckCircle2,
      gradient: "from-green-500/20 via-emerald-500/20 to-green-500/20",
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10 border-green-500/20",
      trend: "+8%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trendUp ? TrendingUp : TrendingDown
        return (
          <Card key={card.title} className="relative overflow-hidden glass-card glass-card-hover gradient-border">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 shimmer`} />

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${card.trendUp ? "text-success" : "text-destructive"}`}
                >
                  <TrendIcon className="h-3 w-3" />
                  {card.trend}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-4xl font-bold tracking-tight">
                  {isLoading ? (
                    <span className="inline-block w-16 h-10 bg-muted/50 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-xl`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
