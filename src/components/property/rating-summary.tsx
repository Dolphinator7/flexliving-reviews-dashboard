"use client"

import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PropertyStats } from "@/types/review"

interface RatingSummaryProps {
  stats: PropertyStats
}

export function RatingSummary({ stats }: RatingSummaryProps) {
  const { average_rating, total_reviews, rating_distribution } = stats

  const ratings = [5, 4, 3, 2, 1]

  return (
    <Card className="relative overflow-hidden p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50" />

      <div className="relative space-y-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-5xl font-bold text-foreground">{average_rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground text-base">{total_reviews}</p>
            <p>{total_reviews === 1 ? "review" : "reviews"}</p>
          </div>
        </div>

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
                <span className="text-sm font-medium text-muted-foreground w-10 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
