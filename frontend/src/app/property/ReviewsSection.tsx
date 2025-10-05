// src/components/property/ReviewSection.tsx
import React from "react"
import { Review } from "@/hooks/use-property"
import { SOURCE_STYLES } from "@/lib/constants"

interface ReviewSectionProps {
  reviews: Review[]
  stats?: { total_reviews: number; average_rating: number }
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, stats }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews available yet.</p>
  }

  // Filter only approved reviews
  const approvedReviews = reviews.filter((r) => r.status === "approved")

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {approvedReviews.map((review) => {
        const style = SOURCE_STYLES[review.channel] || SOURCE_STYLES.unknown

        return (
          <div
            key={review.id}
            className="p-4 border shadow-lg rounded-2xl bg-background/80 backdrop-blur-md border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`px-2 py-1 rounded-full text-white text-sm bg-gradient-to-r ${style.color}`}
              >
                {style.icon} {style.label}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(review.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-3 text-gray-200">{review.publicReview}</p>
            <div className="flex justify-between text-sm text-gray-400">
              <span>⭐ {review.rating.toFixed(1)}</span>
              <span>- {review.guestName}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
