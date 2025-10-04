"use client"

import { MessageSquare } from "lucide-react"
import { RatingSummary } from "./rating-summary"
import { ReviewCard } from "./review-card"
import type { Review, PropertyStats } from "@/types/review"

interface ReviewSectionProps {
  stats: PropertyStats
  reviews: Review[]
}

export function ReviewSection({ stats, reviews }: ReviewSectionProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <RatingSummary stats={stats} />

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Guest Reviews</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  )
}

