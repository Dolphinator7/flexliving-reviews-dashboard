"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Star, MoreHorizontal, Check, X, Eye, User, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/types/review"
import { ReviewStatus } from "@/enums/review"
import { REVIEW_SOURCE_LABELS, REVIEW_STATUS_LABELS } from "@/lib/constants"
import { reviewsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useReviews } from "@/hooks/use-reviews"

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
    const config = {
      [ReviewStatus.PENDING]: {
        color: "bg-warning/20 text-warning border-warning/30",
        dotColor: "bg-warning",
      },
      [ReviewStatus.APPROVED]: {
        color: "bg-success/20 text-success border-success/30",
        dotColor: "bg-success",
      },
      [ReviewStatus.REJECTED]: {
        color: "bg-destructive/20 text-destructive border-destructive/30",
        dotColor: "bg-destructive",
      },
    }

    const { color, dotColor } = config[status]

    return (
      <Badge className={`font-medium ${color} border backdrop-blur-sm`}>
        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${dotColor} animate-pulse`} />
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
            className={`h-3.5 w-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
        <span className="ml-1.5 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 glass-card">
        <div className="text-center space-y-3">
          <div className="p-4 rounded-full bg-muted/20 w-fit mx-auto border border-white/10">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No reviews found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden glass-card gradient-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Property
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Guest
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rating
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">Review</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Source</TableHead>
              <TableHead className="text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id} className="border-white/10 hover:bg-primary/5 transition-colors">
                <TableCell className="font-semibold text-foreground">{review.property_name}</TableCell>
                <TableCell className="text-muted-foreground">{review.guest_name}</TableCell>
                <TableCell>{renderStars(review.rating)}</TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{review.comment}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-white/10 glass-card">
                    {REVIEW_SOURCE_LABELS[review.source]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-medium">
                  {format(new Date(review.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        disabled={updatingId === review.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10">
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
    </div>
  )
}
