export enum ReviewSource {
  HOSTAWAY = "hostaway",
  GOOGLE = "google",
  AIRBNB = "airbnb",
  BOOKING = "booking",
}

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum SortField {
  DATE = "date",
  RATING = "rating",
  PROPERTY = "property",
}

export interface ReviewFilters {
  rating?: number
  source?: string
  dateRange?: {
    from: string
    to: string
  }
}

// src/types/review.ts

export interface PropertyStats {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    [key: number]: number // e.g. {5: 10, 4: 3, 3: 2, 2: 1, 1: 0}
  }
}

// Individual review
// src/types/review.ts
export interface Review {
  id: string
  guest_name: string   // mapped from reviewer_name
  rating: number
  comment: string
  source: string       // mapped from platform
  date: string         // mapped from created_at
}
