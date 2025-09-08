import { getAnalyticsData } from "@/lib/analytics"
import { AdminHeader } from "@/components/admin/admin-header"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData()

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Analytics & Insights"
        description="Comprehensive platform performance and user engagement metrics"
      />

      <div className="flex-1 overflow-auto p-6">
        <AnalyticsCharts data={analyticsData} />
      </div>
    </div>
  )
}
