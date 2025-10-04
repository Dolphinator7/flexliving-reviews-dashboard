import useSWR from "swr"
import { propertiesAPI } from "@/lib/api"

// 🏠 Fetch a single property by ID/slug
export function useProperty(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/properties/${id}` : null,
    () => propertiesAPI.getProperty(id)
  )

  return {
    property: data,
    isLoading,
    isError: error,
  }
}

// 💬 Fetch all reviews for a specific property
export function usePropertyReviews(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/properties/${id}/reviews` : null,
    () => propertiesAPI.getReviews(id)
  )

  return {
    reviews: data,
    isLoading,
    isError: error,
  }
}

// 📊 Fetch property stats (average rating, total reviews, etc.)
export function usePropertyStats(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/properties/${id}/stats` : null,
    () => propertiesAPI.getStats(id)
  )

  return {
    stats: data,
    isLoading,
    isError: error,
  }
}
