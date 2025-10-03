"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Star, MoreHorizontal, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/types/review"
import type { ReviewStatus } from "@/types/review"
import { REVIEW_SOURCE_LABELS, REVIEW_STATUS_LABELS } from "@/lib/constants"
import { reviewsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ReviewsTableProps {
  reviews: Review[]
  onReviewUpdate: () => void
}

export function ReviewsTable({ reviews, onReviewUpdate }: ReviewsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleUpdateStatus = async (reviewId: string, status: ReviewStatus) => {
    setUpdatingId(reviewId)
    try {
      await reviewsAPI.updateReview(reviewId, { status })
      toast({
        title: "Review updated",
        description: `Review ${status === ReviewStatus.APPROVED ? "approved" : "rejected"} successfully.`,
      })
      onReviewUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: ReviewStatus) => {
    const variants: Record<ReviewStatus, "default" | "secondary" | "destructive"> = {
      [ReviewStatus.PENDING]: "secondary",
      [ReviewStatus.APPROVED]: "default",
      [ReviewStatus.REJECTED]: "destructive",
    }

    return (
      <Badge variant={variants[status]} className="font-normal">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
            status === ReviewStatus.APPROVED
              ? "bg-success"
              : status === ReviewStatus.PENDING
                ? "bg-warning"
                : "bg-destructive"
          }`}
        />
        {REVIEW_STATUS_LABELS[status]}
      </Badge>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground">No reviews found</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Property</TableHead>
            <TableHead className="text-muted-foreground">Guest</TableHead>
            <TableHead className="text-muted-foreground">Rating</TableHead>
            <TableHead className="text-muted-foreground">Review</TableHead>
            <TableHead className="text-muted-foreground">Source</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id} className="border-border hover:bg-secondary/50">
              <TableCell className="font-medium">{review.property_name}</TableCell>
              <TableCell className="text-muted-foreground">{review.guest_name}</TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{REVIEW_SOURCE_LABELS[review.source]}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(review.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{getStatusBadge(review.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updatingId === review.id}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(review.id, ReviewStatus.APPROVED)}
                      disabled={review.status === ReviewStatus.APPROVED}
                      className="cursor-pointer"
                    >
                      <Check className="mr-2 h-4 w-4 text-success" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(review.id, ReviewStatus.REJECTED)}
                      disabled={review.status === ReviewStatus.REJECTED}
                      className="cursor-pointer"
                    >
                      <X className="mr-2 h-4 w-4 text-destructive" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
