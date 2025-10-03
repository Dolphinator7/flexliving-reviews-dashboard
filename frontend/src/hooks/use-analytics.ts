"use client"

import useSWR from "swr"
import { analyticsAPI } from "@/lib/api"

export function useAnalytics() {
  const { data, error, isLoading } = useSWR("analytics", analyticsAPI.fetchAnalytics)

  return {
    analytics: data,
    isLoading,
    isError: error,
  }
}
