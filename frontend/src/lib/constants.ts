// src/lib/constants.ts

// Base API URL (from .env.local or fallback to local backend)
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// -------------------------
// Review Sources
// -------------------------
export const REVIEW_SOURCES = {
  hostaway: "hostaway",
  google: "google",
  airbnb: "airbnb",
  booking: "booking",
  manual: "manual",
} as const

export const REVIEW_SOURCE_LABELS: Record<string, string> = {
  [REVIEW_SOURCES.hostaway]: "Hostaway",
  [REVIEW_SOURCES.google]: "Google",
  [REVIEW_SOURCES.airbnb]: "Airbnb",
  [REVIEW_SOURCES.booking]: "Booking.com",
  [REVIEW_SOURCES.manual]: "Manual Entry",
}

// -------------------------
// Review Statuses
// -------------------------
export const REVIEW_STATUSES = {
  approved: "approved",
  pending: "pending",
  rejected: "rejected",
} as const

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  [REVIEW_STATUSES.approved]: "Approved",
  [REVIEW_STATUSES.pending]: "Pending",
  [REVIEW_STATUSES.rejected]: "Rejected",
}

// -------------------------
// Review Categories
// -------------------------
export const REVIEW_CATEGORIES = {
  cleanliness: "Cleanliness",
  communication: "Communication",
  accuracy: "Accuracy",
  location: "Location",
  checkin: "Check-in",
  value: "Value",
  respect_house_rules: "Respect House Rules",
}
