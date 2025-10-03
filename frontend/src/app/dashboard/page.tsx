"use client"

import { useState } from "react"
import Link from "next/link"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FiltersPanel } from "@/components/dashboard/filters-panel"
import { ReviewsTable } from "@/components/dashboard/reviews-table"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { useReviews } from "@/hooks/use-reviews"
import type { ReviewFilters } from "@/types/review"
import { SortField } from "@/enums/review"
import { Building2, ExternalLink, LayoutDashboard, Sparkles, TrendingUp, BarChart3, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [filters, setFilters] = useState<ReviewFilters & { sort_by?: SortField; sort_desc?: boolean }>({
    sort_by: SortField.DATE,
    sort_desc: true,
  })

  const { reviews, isLoading, mutate } = useReviews(filters)

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <header className="sticky top-0 z-50 glass-card border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl neon-glow">
                <Building2 className="h-6 w-6 text-background" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold neon-text">FlexLiving</h1>
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" />
                  Analytics Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/property/prop_001">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-card glass-card-hover border-white/10 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl glass-card border-primary/30">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  Overview
                  <TrendingUp className="h-6 w-6 text-success" />
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  Monitor and manage your property reviews in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <StatsCards />

          <AnalyticsCharts />

          {/* Filters */}
          <FiltersPanel onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })} />

          {/* Reviews Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Recent Reviews
                </h3>
                <p className="text-sm text-muted-foreground">
                  {reviews ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} found` : "Loading..."}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 glass-card">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto neon-glow" />
                  <p className="text-muted-foreground font-medium">Loading reviews...</p>
                </div>
              </div>
            ) : (
              <ReviewsTable reviews={reviews || []} onReviewUpdate={() => mutate()} />
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 glass-card border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 FlexLiving. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-primary font-medium flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Powered by Advanced Analytics
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
