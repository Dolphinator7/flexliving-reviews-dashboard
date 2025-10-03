"use client"

import useSWR from "swr"
import { reviewsAPI } from "@/lib/api"
import type { ReviewFilters } from "@/types/review"
import type { SortField } from "@/types/review"

export function useReviews(
  filters?: ReviewFilters & {
    sort_by?: SortField
    sort_desc?: boolean
  },
) {
  const { data, error, isLoading, mutate } = useSWR(["/reviews", filters], () => reviewsAPI.getReviews(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    reviews: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useOverallStats() {
  const { data, error, isLoading } = useSWR("/stats/overall", () => reviewsAPI.getOverallStats(), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  return {
    stats: data,
    isLoading,
    isError: error,
  }
}
