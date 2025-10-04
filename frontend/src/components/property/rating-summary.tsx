"use client"

import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PropertyStats } from "@/types/review"

interface RatingSummaryProps {
  stats?: PropertyStats // make stats optional to handle undefined
}

export function RatingSummary({ stats }: RatingSummaryProps) {
  // 🛡️ Provide safe defaults
  const average_rating = stats?.average_rating ?? 0
  const total_reviews = stats?.total_reviews ?? 0
  const rating_distribution = stats?.rating_distribution ?? {}

  const ratings = [5, 4, 3, 2, 1]

  // 🩹 Early return if no data
  if (!stats) {
    return (
      <Card className="p-6 text-center bg-card/50 border-border/50 text-muted-foreground">
        <p>Loading ratings...</p>
      </Card>
    )
  }

  return (
    <Card className="relative p-6 overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-primary/10 to-accent/5" />

      <div className="relative space-y-6">
        {/* Average rating + total reviews */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 border rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-5xl font-bold text-foreground">{average_rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="text-base font-semibold text-foreground">{total_reviews}</p>
            <p>{total_reviews === 1 ? "review" : "reviews"}</p>
          </div>
        </div>

        {/* Rating bars */}
        <div className="space-y-3">
          {ratings.map((rating) => {
            const count = rating_distribution[rating] || 0
            const percentage = total_reviews > 0 ? (count / total_reviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-14">
                  <span className="text-sm font-semibold text-foreground">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2.5" />
                <span className="w-10 text-sm font-medium text-right text-muted-foreground">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
