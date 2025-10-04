"use client"

import { format } from "date-fns"
import {
  Star,
  CalendarDays,
  User,
  MessageSquareQuote,
  Globe2,
} from "lucide-react"
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
    <Card className="relative p-6 overflow-hidden transition-all duration-300 border shadow-md bg-black/40 backdrop-blur-xl border-white/10 rounded-2xl hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
      {/* Glass Glow Border Effect */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-40" />

      <div className="relative space-y-5">
        {/* Guest Info + Rating */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="w-12 h-12 border shadow-sm border-white/20 bg-gradient-to-br from-primary/20 to-accent/20">
              <AvatarFallback className="font-semibold text-primary/90">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name + Date */}
            <div>
              <p className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <User className="w-4 h-4 text-primary" />
                {review.guest_name}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarDays className="w-3 h-3 text-accent" />
                {format(new Date(review.date), "MMMM yyyy")}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className="flex items-start gap-2 italic leading-relaxed text-foreground/90">
          <MessageSquareQuote className="w-4 h-4 mt-1 text-primary/70" />
          “{review.comment}”
        </p>

        {/* Review Source Chip */}
        <div className="flex items-center">
          <span
            className="flex items-center gap-2 px-3 py-1 text-xs font-medium border rounded-full shadow-sm text-foreground/90 bg-gradient-to-r from-primary/10 to-accent/10 border-white/10 backdrop-blur-sm"
          >
            <Globe2 className="w-3 h-3 text-accent" />
            via {REVIEW_SOURCE_LABELS[review.source]}
          </span>
        </div>
      </div>
    </Card>
  )
}

