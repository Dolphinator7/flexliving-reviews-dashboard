"use client"

import { format } from "date-fns"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Review } from "@/types/review"
import { REVIEW_SOURCE_LABELS } from "@/lib/constants"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.guest_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="relative overflow-hidden p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

      <div className="relative space-y-4">
        {/* Guest Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 bg-gradient-to-br from-primary to-accent border-2 border-primary/20">
              <AvatarFallback className="bg-transparent text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{review.guest_name}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(review.date), "MMMM yyyy")}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-foreground/90 leading-relaxed">{review.comment}</p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md border border-border/50">
            via {REVIEW_SOURCE_LABELS[review.source]}
          </span>
        </div>
      </div>
    </Card>
  )
}
