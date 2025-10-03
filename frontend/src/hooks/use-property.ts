"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/api"
import type { Property, PropertyStats, Review } from "@/types/property"

export function useProperty(id: string) {
  const { data, error, isLoading } = useSWR(`/properties/${id}`, fetcher)
  return {
    property: data?.data as Property,
    isLoading,
    isError: error,
  }
}

export function usePropertyReviews(id: string) {
  const { data, error, isLoading } = useSWR(`/reviews?propertyId=${id}`, fetcher)
  return {
    reviews: data?.data as Review[],
    isLoading,
    isError: error,
  }
}

export function usePropertyStats(id: string) {
  const { data, error, isLoading } = useSWR(`/reviews/stats?propertyId=${id}`, fetcher)
  return {
    stats: data?.data as PropertyStats,
    isLoading,
    isError: error,
  }
}
