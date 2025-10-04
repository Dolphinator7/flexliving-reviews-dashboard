"use client"

import { useState } from "react"
import {
  Search,
  X,
  Filter,
  Sliders,
  Database,
  CheckCircle,
  StarIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ReviewSource, ReviewStatus } from "@/types/review"
import {
  REVIEW_SOURCE_LABELS,
  REVIEW_STATUS_LABELS,
} from "@/lib/constants"

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
    <div className="relative overflow-hidden border shadow-lg rounded-2xl border-white/20 bg-gradient-to-br from-slate-800/80 via-slate-700/80 to-slate-800/70 backdrop-blur-xl">
      {/* Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-30" />

      <div className="relative p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/40 shadow-inner">
              <Sliders className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                Advanced Filters
                <Filter className="w-4 h-4 text-primary/80" />
              </h3>
              <p className="text-xs text-white/70">
                Refine your search results with precision
              </p>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-primary/80" />
            <Input
              placeholder="Search reviews, guests, properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-white transition-all border pl-9 rounded-xl bg-slate-700/50 border-white/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 placeholder-white/50"
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>

          {/* Source */}
          <div className="relative">
            <Database className="absolute z-10 w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60" />
            <Select
              value={source}
              onValueChange={(v) => setSource(v as ReviewSource | "all")}
            >
              <SelectTrigger className="text-white border pl-9 rounded-xl bg-slate-700/50 border-white/20 focus:border-primary/60">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent className="text-white border shadow-xl rounded-xl bg-slate-800 border-white/20">
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(REVIEW_SOURCE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="relative">
            <CheckCircle className="absolute z-10 w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60" />
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ReviewStatus | "all")}
            >
              <SelectTrigger className="text-white border pl-9 rounded-xl bg-slate-700/50 border-white/20 focus:border-primary/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="text-white border shadow-xl rounded-xl bg-slate-800 border-white/20">
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Rating */}
          <div className="relative">
            <StarIcon className="absolute z-10 w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/60" />
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="text-white border pl-9 rounded-xl bg-slate-700/50 border-white/20 focus:border-primary/60">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent className="text-white border shadow-xl rounded-xl bg-slate-800 border-white/20">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleApplyFilters}
            size="sm"
            className="px-4 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-primary via-indigo-500 to-accent hover:opacity-90 hover:shadow-lg"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="px-4 text-white transition-all border rounded-lg border-white/20 bg-slate-700/50 hover:bg-slate-600/70"
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
