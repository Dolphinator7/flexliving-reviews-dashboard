"use client"

import { Star, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PropertyStats } from "@/types/review"

interface RatingSummaryProps {
  stats?: PropertyStats
}

export function RatingSummary({ stats }: RatingSummaryProps) {
  const average_rating = stats?.average_rating ?? 0
  const total_reviews = stats?.total_reviews ?? 0
  const rating_distribution = stats?.rating_distribution ?? {}

  const ratings = [5, 4, 3, 2, 1]

  if (!stats) {
    return (
      <Card className="p-6 text-center border shadow-sm bg-card/50 border-border/40 text-muted-foreground rounded-xl backdrop-blur-sm">
        <p>Loading ratings...</p>
      </Card>
    )
  }

  return (
    <Card className="relative p-6 overflow-hidden border shadow-lg border-border/40 bg-black/40 backdrop-blur-xl rounded-2xl">
      {/* Gradient glow overlay */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />

      <div className="relative space-y-8">
        {/* Average rating + total reviews */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-4 shadow-inner rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md" />
            </div>
            <span className="text-5xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
              {average_rating.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-col items-start gap-1 text-sm leading-snug">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="w-4 h-4 text-primary" />
              {total_reviews}
            </div>
            <p className="text-muted-foreground">
              {total_reviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating distribution bars */}
        <div className="space-y-4">
          {ratings.map((rating) => {
            const count = rating_distribution[rating] || 0
            const percentage =
              total_reviews > 0 ? (count / total_reviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                {/* Left: rating number + star */}
                <div className="flex items-center gap-1.5 w-14">
                  <span className="text-sm font-semibold text-foreground">{rating}</span>
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                </div>

                {/* Middle: progress bar */}
                <Progress
                  value={percentage}
                  className="flex-1 h-2.5 overflow-hidden rounded-full 
                             bg-muted backdrop-blur-sm border border-white/10"
                />

                {/* Right: count */}
                <span className="w-10 text-sm font-medium text-right text-muted-foreground">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
