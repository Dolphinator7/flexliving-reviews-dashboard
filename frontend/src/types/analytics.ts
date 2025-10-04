// src/types/analytics.ts

export interface RatingDistributionItem {
  rating: number
  count: number
  percentage: number
}

export interface SourceDistributionItem {
  source: string
  count: number
}

export interface SentimentItem {
  label: string
  value: number
}

export interface AnalyticsData {
  ratingDistribution: RatingDistributionItem[]
  sourceDistribution: SourceDistributionItem[]
  sentiment: SentimentItem[]
}
