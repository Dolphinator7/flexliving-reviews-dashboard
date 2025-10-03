"use client"

import { Card } from "@/components/ui/card"
import { Star, MessageSquare, Clock, CheckCircle2, TrendingUp } from "lucide-react"
import { useOverallStats } from "@/hooks/use-reviews"

export function StatsCards() {
  const { stats, isLoading } = useOverallStats()

  const cards = [
    {
      title: "Total Reviews",
      value: stats?.total_reviews ?? 0,
      icon: MessageSquare,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      trend: "+12%",
    },
    {
      title: "Average Rating",
      value: stats?.average_rating?.toFixed(1) ?? "0.0",
      icon: Star,
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
      trend: "+0.3",
    },
    {
      title: "Pending Review",
      value: stats?.pending_reviews ?? 0,
      icon: Clock,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
      trend: "-5%",
    },
    {
      title: "Approved",
      value: stats?.approved_reviews ?? 0,
      icon: CheckCircle2,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
      trend: "+8%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.title}
            className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />

            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight">{isLoading ? "..." : card.value}</p>
                    <span className="text-xs font-medium text-success flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {card.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-background/50 border border-border/50`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
