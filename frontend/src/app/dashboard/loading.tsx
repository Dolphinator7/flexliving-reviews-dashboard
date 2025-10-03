import type React from "react"

export default function DashboardLoading(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-32 bg-card border border-border rounded-lg animate-pulse" />
          <div className="h-96 bg-card border border-border rounded-lg animate-pulse" />
        </div>
      </main>
    </div>
  )
}
