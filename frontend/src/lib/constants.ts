// constants.ts
import { ReviewSource, ReviewStatus } from "@/enums/review" // <-- must be a normal import, not "import type"

export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  [ReviewSource.HOSTAWAY]: "Hostaway",
  [ReviewSource.GOOGLE]: "Google",
  [ReviewSource.AIRBNB]: "Airbnb",
  [ReviewSource.BOOKING]: "Booking.com",
}

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  [ReviewStatus.PENDING]: "Pending",
  [ReviewStatus.APPROVED]: "Approved",
  [ReviewStatus.REJECTED]: "Rejected",
}

export const RATING_OPTIONS = [
  { value: "1", label: "1 Star" },
  { value: "2", label: "2 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "5", label: "5 Stars" },
]
