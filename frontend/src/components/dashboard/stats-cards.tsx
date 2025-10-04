"use client"

import { Card } from "@/components/ui/card"
import {
  Star,
  MessageSquare,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useEffect, useState } from "react"
import { API_URL } from "@/lib/constants"

// ✅ Hook to fetch reviews & compute stats
function useMockupStats() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/reviews`)
        const json = await res.json()

        if (json.status === "success") {
          const reviews = json.result
          const total = reviews.length

          const avg =
            reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
            (total || 1)

          // count statuses
          const approved = reviews.filter(
            (r: any) => r.status === "approved" || r.status === "published"
          ).length
          const pending = reviews.filter((r: any) => r.status === "pending").length

          setStats({
            total_reviews: total,
            average_rating: avg,
            approved_reviews: approved,
            pending_reviews: pending,
          })
        } else {
          setStats({
            total_reviews: 0,
            average_rating: 0,
            approved_reviews: 0,
            pending_reviews: 0,
          })
        }
      } catch (err) {
        setStats({
          total_reviews: 0,
          average_rating: 0,
          approved_reviews: 0,
          pending_reviews: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { stats, isLoading }
}

export function StatsCards() {
  const { stats, isLoading } = useMockupStats()

  const cards = [
    {
      title: "Total Reviews",
      value: stats?.total_reviews ?? 0,
      icon: MessageSquare,
      gradient: "from-cyan-500/30 via-blue-500/30 to-indigo-500/30",
      iconColor: "text-cyan-300",
      iconBg: "bg-cyan-500/20 border-cyan-500/40",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Average Rating",
      value: stats?.average_rating?.toFixed(1) ?? "0.0",
      icon: Star,
      gradient: "from-yellow-500/30 via-orange-500/30 to-amber-500/30",
      iconColor: "text-yellow-300",
      iconBg: "bg-yellow-500/20 border-yellow-500/40",
      trend: "+0.3",
      trendUp: true,
    },
    {
      title: "Pending Reviews",
      value: stats?.pending_reviews ?? 0,
      icon: Clock,
      gradient: "from-purple-500/30 via-pink-500/30 to-fuchsia-500/30",
      iconColor: "text-purple-300",
      iconBg: "bg-purple-500/20 border-purple-500/40",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Approved Reviews",
      value: stats?.approved_reviews ?? 0,
      icon: CheckCircle2,
      gradient: "from-green-500/30 via-emerald-500/30 to-teal-500/30",
      iconColor: "text-green-300",
      iconBg: "bg-green-500/20 border-green-500/40",
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
          <Card
            key={card.title}
            className="relative overflow-hidden transition-all duration-300 border border-gray-800 shadow-lg rounded-2xl bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 shadow-black/40 hover:shadow-xl"
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 blur-xl`}
            />

            <div className="relative p-6">
              {/* Header: Icon + Trend */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    card.trendUp ? "text-green-400" : "text-rose-400"
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {card.trend}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className="text-4xl font-bold tracking-tight text-white drop-shadow">
                  {isLoading ? (
                    <span className="inline-block w-16 h-10 bg-gray-700 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 hover:opacity-100">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-2xl`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
