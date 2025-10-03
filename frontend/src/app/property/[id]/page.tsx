"use client"

import Link from "next/link"
import { ArrowLeft, MapPin, Star, Building2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReviewSection } from "@/components/property/review-section"
import { useProperty, usePropertyReviews, usePropertyStats } from "@/hooks/use-property"

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { property, isLoading: propertyLoading } = useProperty(id)
  const { reviews, isLoading: reviewsLoading } = usePropertyReviews(id)
  const { stats, isLoading: statsLoading } = usePropertyStats(id)

  if (propertyLoading || reviewsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-foreground text-xl font-semibold">Property not found</p>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent opacity-50" />
        <div className="container relative mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
                <Building2 className="h-6 w-6 text-primary-foreground" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">Flex Living</h1>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full h-[400px] bg-muted relative overflow-hidden">
        <img
          src={property.image_url || "/placeholder.svg?height=400&width=1200"}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-8">
          <div className="space-y-4 -mt-20 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-foreground text-balance">{property.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {property.address}, {property.city}
                  </span>
                </div>
              </div>
              {stats && (
                <div className="flex items-center gap-2 bg-gradient-to-br from-primary to-accent text-primary-foreground px-5 py-3 rounded-xl shadow-lg shadow-primary/20">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-xl">{stats.average_rating.toFixed(1)}</span>
                  <span className="text-sm opacity-90">({stats.total_reviews})</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Reviews Section */}
          <div id="reviews" className="scroll-mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Guest Reviews</h2>
            {stats && reviews ? (
              <ReviewSection stats={stats} reviews={reviews} />
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading reviews...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2025 Flex Living. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <span>&middot;</span>
              <a href="#reviews" className="hover:text-foreground transition-colors">
                Reviews
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
