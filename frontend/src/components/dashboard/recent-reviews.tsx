"use client"

import { Card } from "@/components/ui/card"
import { useReviews } from "@/hooks/use-reviews"
import { Star, MessageSquare } from "lucide-react"

export function RecentReviews() {
  const { reviews, isLoading } = useReviews()

  if (isLoading) {
    return (
      <Card className="p-6 border border-gray-700 shadow-md bg-gray-800/70">
        <p className="text-gray-300">Loading recent reviews...</p>
      </Card>
    )
  }

  if (!reviews.length) {
    return (
      <Card className="p-6 border border-gray-700 shadow-md bg-gray-800/70">
        <p className="text-gray-300">No reviews found.</p>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border shadow-lg bg-gray-800/70 border-indigo-500/20 shadow-indigo-500/10">
      {/* Gradient overlay for glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-60" />

      <div className="relative p-6 space-y-4">
        {/* Section Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 border rounded-lg bg-indigo-500/10 border-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
          </div>
          <h4 className="text-lg font-semibold text-white">Recent Reviews</h4>
        </div>

        {/* Scrollable reviews */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="p-4 transition duration-300 border rounded-lg bg-gray-700/40 border-gray-600/30 hover:border-indigo-500/40 hover:bg-gray-700/60"
            >
              {/* Header: Guest + Stars */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-200">
                  {review.guestName || "Anonymous"}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow"
                    />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="mt-2 text-sm italic text-gray-300 line-clamp-2">
                “{review.publicReview}”
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span className="truncate">{review.listingName}</span>
                <span>{new Date(review.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
