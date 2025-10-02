import type React from "react"

export default function PropertyLoading(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-96 bg-muted animate-pulse" />
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="h-12 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-6 w-1/2 bg-muted animate-pulse rounded" />
          <div className="h-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}
