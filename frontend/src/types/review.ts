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