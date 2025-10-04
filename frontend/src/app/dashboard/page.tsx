"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FiltersPanel } from "@/components/dashboard/filters-panel"
import { ReviewsTable } from "@/components/dashboard/reviews-table"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { useReviews } from "@/hooks/use-reviews"
import type { ReviewFilters } from "@/types/review"
import { SortField } from "@/enums/review"
import { propertiesAPI } from "@/lib/api"
import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Property = {
  id: string
  name: string
  address: string
  city: string
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<
    ReviewFilters & { sort_by?: SortField; sort_desc?: boolean }
  >({
    sort_by: SortField.DATE,
    sort_desc: true,
  })

  const { reviews, isLoading, mutate } = useReviews(filters)

  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const router = useRouter()

  useEffect(() => {
    propertiesAPI
      .list()
      .then(setProperties)
      .catch((err) => console.error("Failed to load properties:", err))
      .finally(() => setLoadingProperties(false))
  }, [])

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b glass-card border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container relative px-6 py-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl neon-glow">
                <Building2 className="w-6 h-6 text-background" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold neon-text">FlexLiving</h1>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BarChart3 className="w-3 h-3" />
                  Analytics Dashboard
                </p>
              </div>
            </div>

            {/* Property Selector */}
            <div className="flex items-center gap-3">
              {loadingProperties ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 rounded-full border-primary border-t-transparent animate-spin" />
                  Loading...
                </div>
              ) : (
                <Select onValueChange={(id) => router.push(`/property/${id}`)}>
                  <SelectTrigger className="w-64 border glass-card border-white/10">
                    <SelectValue placeholder="Select a property..." />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="font-medium">{p.name}</span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({p.city})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Link href="/property/shoreditch-heights">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent glass-card glass-card-hover border-white/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Default Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container px-6 py-10 mx-auto">
        <div className="space-y-8">
          {/* Overview */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl glass-card border-primary/30">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-3xl font-bold text-foreground">
                  Overview
                  <TrendingUp className="w-6 h-6 text-success" />
                </h2>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  Monitor and manage your property reviews in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <StatsCards />

          {/* Charts */}
          <AnalyticsCharts />

          {/* Filters */}
          <FiltersPanel
            onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
          />

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Reviews
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reviews
                    ? `${reviews.length} ${
                        reviews.length === 1 ? "review" : "reviews"
                      } found`
                    : "Loading..."}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 glass-card">
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 mx-auto border-4 rounded-full border-primary/30 border-t-primary animate-spin neon-glow" />
                  <p className="font-medium text-muted-foreground">
                    Loading reviews...
                  </p>
                </div>
              </div>
            ) : (
              <ReviewsTable reviews={reviews || []} onReviewUpdate={() => mutate()} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t glass-card border-white/10">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 FlexLiving. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 font-medium text-primary">
                <Sparkles className="w-3 h-3" />
                Powered by Advanced Analytics
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
