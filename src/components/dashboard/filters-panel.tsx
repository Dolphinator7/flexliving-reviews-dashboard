"use client"

import { useState } from "react"
import { Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ReviewSource, ReviewStatus } from "@/types/review"
import { REVIEW_SOURCE_LABELS, REVIEW_STATUS_LABELS } from "@/lib/constants"

interface FiltersPanelProps {
  onFiltersChange: (filters: {
    search?: string
    source?: ReviewSource
    status?: ReviewStatus
    min_rating?: number
  }) => void
}

export function FiltersPanel({ onFiltersChange }: FiltersPanelProps) {
  const [search, setSearch] = useState("")
  const [source, setSource] = useState<ReviewSource | "all">("all")
  const [status, setStatus] = useState<ReviewStatus | "all">("all")
  const [minRating, setMinRating] = useState<string>("all")

  const handleApplyFilters = () => {
    onFiltersChange({
      search: search || undefined,
      source: source !== "all" ? source : undefined,
      status: status !== "all" ? status : undefined,
      min_rating: minRating !== "all" ? Number(minRating) : undefined,
    })
  }

  const handleReset = () => {
    setSearch("")
    setSource("all")
    setStatus("all")
    setMinRating("all")
    onFiltersChange({})
  }

  return (
    <div className="relative overflow-hidden border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Filter className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Advanced Filters</h3>
              <p className="text-xs text-muted-foreground">Refine your search results</p>
            </div>
          </div>
        </div>

        {/* Filter inputs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews, guests, properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>

          <Select value={source} onValueChange={(v) => setSource(v as ReviewSource | "all")}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.entries(REVIEW_SOURCE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v as ReviewStatus | "all")}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="1">1+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleApplyFilters}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="border-border/50 bg-background/50 hover:bg-background"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
