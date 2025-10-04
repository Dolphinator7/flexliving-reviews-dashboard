import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { RecentReviews } from "@/components/dashboard/recent-reviews"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <AnalyticsCharts />
      <RecentReviews />
    </div>
  )
}
