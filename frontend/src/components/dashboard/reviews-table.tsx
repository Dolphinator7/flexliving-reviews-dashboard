"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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

interface ReviewsTableProps {
  reviews: Review[]
  onReviewUpdate?: () => void
  loading?: boolean
  showApprovalControls?: boolean 
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

export function ReviewsTable({ reviews, loading, onReviewUpdate }: ReviewsTableProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  async function handleStatusChange(id: number, newStatus: "approved" | "rejected") {
    try {
      setUpdatingId(id)
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      const result = data.result || data // unwrap wrapper response

      if (res.ok) {
        toast({
          title: "Success",
          description: `Review ${newStatus === "approved" ? "approved" : "rejected"} successfully.`,
        })
        onReviewUpdate?.()
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to update review.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Network error while updating review.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-400">
        Loading reviews...
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
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
            <TableHead className="font-semibold text-center text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reviews.map((review) => (
            <TableRow
              key={review.id}
              className="transition-all duration-300 hover:bg-gray-800/70 hover:shadow-md hover:shadow-indigo-500/10"
            >
              <TableCell className="font-medium text-gray-200">{review.guestName}</TableCell>
              <TableCell className="text-gray-300">{review.listingName}</TableCell>
              <TableCell className="text-gray-400">{review.channel}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-[280px] truncate text-gray-300" title={review.publicReview}>
                {review.publicReview}
              </TableCell>
              <TableCell className="text-sm text-gray-400">
                {review.submittedAt ? format(new Date(review.submittedAt), "MMM d, yyyy") : "—"}
              </TableCell>
              <TableCell>{getStatusBadge(review.status)}</TableCell>
              <TableCell className="text-center">
                {review.status === "pending" && (
                  <div className="flex justify-center gap-2">
                    <button
                      disabled={updatingId === review.id}
                      onClick={() => handleStatusChange(review.id, "approved")}
                      className="p-2 text-green-400 transition hover:text-green-300 disabled:opacity-50"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      disabled={updatingId === review.id}
                      onClick={() => handleStatusChange(review.id, "rejected")}
                      className="p-2 text-red-400 transition hover:text-red-300 disabled:opacity-50"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {onReviewUpdate && (
        <div className="p-4 text-center">
          <button
            onClick={onReviewUpdate}
            className="px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Refresh Reviews
          </button>
        </div>
      )}
    </div>
  )
}
