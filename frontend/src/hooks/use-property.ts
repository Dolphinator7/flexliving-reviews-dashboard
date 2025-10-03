"use client"

import useSWR from "swr"
import { propertiesAPI, reviewsAPI } from "@/lib/api"
import type { ReviewStatus } from "@/types/review"

export function useProperty(propertyId: string) {
  const { data, error, isLoading } = useSWR(
    propertyId ? `/properties/${propertyId}` : null,
    () => propertiesAPI.getProperty(propertyId),
    {
      revalidateOnFocus: false,
    },
  )

  return {
    property: data,
    isLoading,
    isError: error,
  }
}

export function usePropertyReviews(propertyId: string) {
  const { data, error, isLoading } = useSWR(
    propertyId ? [`/reviews`, propertyId] : null,
    () =>
      reviewsAPI.getReviews({
        property_id: propertyId,
        status: ReviewStatus.APPROVED, // Only show approved reviews
      }),
    {
      revalidateOnFocus: false,
    },
  )

  return {
    reviews: data,
    isLoading,
    isError: error,
  }
}

export function usePropertyStats(propertyId: string) {
  const { data, error, isLoading } = useSWR(
    propertyId ? [`/stats/properties`, propertyId] : null,
    () => reviewsAPI.getPropertyStats(propertyId),
    {
      revalidateOnFocus: false,
    },
  )

  return {
    stats: data?.[0],
    isLoading,
    isError: error,
  }
}
