"use client"

import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Star,
  Building2,
  Sparkles,
  Home,
  Wifi,
  Bath,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { ReviewSection } from "@/components/property/review-section"
import {
  useProperty,
  usePropertyReviews,
  usePropertyStats,
} from "@/hooks/use-property"

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { property, isLoading: propertyLoading } = useProperty(id)
  const { reviews, isLoading: reviewsLoading } = usePropertyReviews(id)
  const { stats, isLoading: statsLoading } = usePropertyStats(id)

  if (propertyLoading || reviewsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background grid-pattern">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 mx-auto border-4 rounded-full border-primary/30 border-t-primary animate-spin neon-glow" />
          <p className="font-medium text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background grid-pattern">
        <div className="space-y-4 text-center">
          <p className="text-xl font-semibold text-foreground">Property not found</p>
          <Link href="/">
            <Button variant="outline" className="hover:bg-primary/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b glass-card border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="container relative px-6 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl neon-glow">
                <Building2 className="w-6 h-6 text-background" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold neon-text">FlexLiving</h1>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative w-full h-[450px] overflow-hidden rounded-b-3xl glass-card">
        <img
          src={property.image_url || "/placeholder.svg?height=450&width=1200"}
          alt={property.name}
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {stats && (
          <div className="absolute px-6 py-3 shadow-lg bottom-6 right-6 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-xl shadow-primary/30">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-xl font-bold">
                {stats.average_rating.toFixed(1)}
              </span>
              <span className="text-sm opacity-90">
                ({stats.total_reviews} reviews)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <main className="container max-w-6xl px-6 py-12 mx-auto">
        <div className="space-y-12">
          {/* Property Title */}
          <div>
            <h1 className="text-4xl font-bold neon-text">{property.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {property.address}, {property.city}
              </span>
            </div>
          </div>

          {/* About Card */}
          <Card className="transition-transform border shadow-xl glass-card border-white/10 hover:shadow-2xl">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold neon-text">About this property</h2>
              <p className="text-lg leading-relaxed text-muted-foreground/90">
                {property.description ||
                  "A beautiful modern property perfect for both short stays and long-term living, equipped with premium amenities and located in a prime area."}
              </p>
            </CardContent>
          </Card>

          {/* Quick Facts + Actions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="transition-transform border shadow-lg glass-card border-white/10 hover:shadow-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold neon-text">Quick Facts</h3>
                <ul className="grid grid-cols-2 gap-4 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" /> 3 Bedrooms
                  </li>
                  <li className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary" /> 2 Bathrooms
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Sleeps 6
                  </li>
                  <li className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-primary" /> Free Wi-Fi
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition-transform border shadow-lg glass-card border-white/10 hover:shadow-xl">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-lg font-semibold neon-text">Actions</h3>
                <Button className="w-full transition-transform shadow-md bg-gradient-to-r from-primary via-pink-500 to-accent text-primary-foreground hover:shadow-lg">
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full transition-transform border-primary/40 text-primary hover:bg-primary/10"
                >
                  Contact Host
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Reviews */}
<div
  id="reviews"
  className="p-8 border shadow-lg scroll-mt-20 glass-card bg-background/80 backdrop-blur-xl border-white/10 rounded-2xl"
>
  <h2 className="mb-6 text-2xl font-bold neon-text">Guest Reviews</h2>
  {stats && reviews ? (
    <ReviewSection stats={stats} reviews={reviews} />
  ) : (
    <div className="py-12 text-center">
      <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary/30 border-t-primary animate-spin neon-glow" />
      <p className="text-muted-foreground">Loading reviews...</p>
    </div>
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
