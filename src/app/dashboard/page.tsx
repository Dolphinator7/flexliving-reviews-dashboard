"use client"

import { useState } from "react"
import Link from "next/link"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FiltersPanel } from "@/components/dashboard/filters-panel"
import { ReviewsTable } from "@/components/dashboard/reviews-table"
import { useReviews } from "@/hooks/use-reviews"
import type { ReviewFilters } from "@/types/review"
import { SortField } from "@/enums/review"
import { Building2, ExternalLink, LayoutDashboard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [filters, setFilters] = useState<ReviewFilters & { sort_by?: SortField; sort_desc?: boolean }>({
    sort_by: SortField.DATE,
    sort_desc: true,
  })

  const { reviews, isLoading, mutate } = useReviews(filters)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent opacity-50" />
        <div className="container relative mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
                <Building2 className="h-6 w-6 text-primary-foreground" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">Flex Living</h1>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Analytics Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/property/prop_001">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 bg-background/50 hover:bg-background hover:border-primary/50 transition-all"
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
          {/* Page Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Overview</h2>
                <p className="text-sm text-muted-foreground">Monitor and manage your property reviews</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <StatsCards />

          {/* Filters */}
          <FiltersPanel onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })} />

          {/* Reviews Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Recent Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  {reviews ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} found` : "Loading..."}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground font-medium">Loading reviews...</p>
                </div>
              </div>
            ) : (
              <ReviewsTable reviews={reviews || []} onReviewUpdate={() => mutate()} />
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 Flex Living. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-primary font-medium">Powered by Analytics</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

