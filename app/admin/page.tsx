import { getAdminStats } from "@/lib/admin"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCards } from "@/components/admin/stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Admin Dashboard" description="Overview of your platform's performance and activity" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <StatsCards stats={stats} />
        <RecentActivity recentUsers={stats.recentUsers} recentPosts={stats.recentPosts} />
      </div>
    </div>
  )
}
