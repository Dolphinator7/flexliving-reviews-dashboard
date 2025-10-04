"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { API_URL } from "@/lib/constants"

interface Review {
  id: number
  rating: number
  publicReview: string
  guestName: string
  listingName: string
  channel: string
  submittedAt: string
  status?: string
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "approved":
      return <Badge className="px-2 py-1 text-green-300 border bg-green-500/20 border-green-500/40">Approved</Badge>
    case "pending":
      return <Badge className="px-2 py-1 text-yellow-300 border bg-yellow-500/20 border-yellow-500/40">Pending</Badge>
    case "rejected":
      return <Badge className="px-2 py-1 text-red-300 border bg-red-500/20 border-red-500/40">Rejected</Badge>
    default:
      return <Badge className="px-2 py-1 text-gray-300 border bg-gray-500/20 border-gray-500/40">Published</Badge>
  }
}

export function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_URL}/reviews`)
        const json = await res.json()

        if (json.status === "success" && Array.isArray(json.result)) {
          setReviews(json.result)
        } else {
          setReviews([])
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-400">
        Loading reviews...
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-400">
        No reviews found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-700 shadow-lg rounded-xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 shadow-black/30">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 bg-gray-800/50">
            <TableHead className="font-semibold text-gray-300">Guest</TableHead>
            <TableHead className="font-semibold text-gray-300">Listing</TableHead>
            <TableHead className="font-semibold text-gray-300">Channel</TableHead>
            <TableHead className="font-semibold text-gray-300">Rating</TableHead>
            <TableHead className="font-semibold text-gray-300">Review</TableHead>
            <TableHead className="font-semibold text-gray-300">Date</TableHead>
            <TableHead className="font-semibold text-gray-300">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reviews.map((review) => (
            <TableRow
              key={review.id}
              className="transition-all duration-300 hover:bg-gray-800/70 hover:shadow-md hover:shadow-indigo-500/10"
            >
              {/* Guest */}
              <TableCell className="font-medium text-gray-200">{review.guestName}</TableCell>

              {/* Listing */}
              <TableCell className="text-gray-300">{review.listingName}</TableCell>

              {/* Channel */}
              <TableCell className="text-gray-400">{review.channel}</TableCell>

              {/* Rating */}
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </TableCell>

              {/* Review text (truncate w/ tooltip) */}
              <TableCell className="max-w-[280px] truncate text-gray-300" title={review.publicReview}>
                {review.publicReview}
              </TableCell>

              {/* Date */}
              <TableCell className="text-sm text-gray-400">
                {review.submittedAt ? format(new Date(review.submittedAt), "MMM d, yyyy") : "—"}
              </TableCell>

              {/* Status Badge */}
              <TableCell>{getStatusBadge(review.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
