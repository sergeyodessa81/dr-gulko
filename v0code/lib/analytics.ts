import { createClient } from "@/lib/supabase/server"

export interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; newUsers: number }>
  contentPerformance: Array<{
    id: string
    title: string
    views: number
    readingTime: number
    completionRate: number
    engagement: number
  }>
  subscriptionMetrics: {
    conversionRate: number
    churnRate: number
    mrr: number
    planDistribution: Array<{ plan: string; count: number; percentage: number }>
  }
  learningAnalytics: {
    totalLearners: number
    averageProgress: number
    completionRate: number
    popularPaths: Array<{ title: string; learners: number; avgProgress: number }>
  }
  engagementMetrics: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    avgSessionDuration: number
    bounceRate: number
  }
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient()

  // Get user growth data for the last 30 days
  const userGrowth = await getUserGrowthData(supabase)

  // Get content performance metrics
  const contentPerformance = await getContentPerformanceData(supabase)

  // Get subscription metrics
  const subscriptionMetrics = await getSubscriptionMetrics(supabase)

  // Get learning analytics
  const learningAnalytics = await getLearningAnalytics(supabase)

  // Get engagement metrics
  const engagementMetrics = await getEngagementMetrics(supabase)

  return {
    userGrowth,
    contentPerformance,
    subscriptionMetrics,
    learningAnalytics,
    engagementMetrics,
  }
}

async function getUserGrowthData(supabase: any) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: users } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at")

  // Group users by date
  const usersByDate = new Map()
  let totalUsers = 0

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split("T")[0]
    usersByDate.set(dateStr, { newUsers: 0, totalUsers: 0 })
  }

  users?.forEach((user) => {
    const dateStr = user.created_at.split("T")[0]
    if (usersByDate.has(dateStr)) {
      usersByDate.get(dateStr).newUsers++
    }
  })

  return Array.from(usersByDate.entries()).map(([date, data]) => {
    totalUsers += data.newUsers
    return {
      date,
      users: totalUsers,
      newUsers: data.newUsers,
    }
  })
}

async function getContentPerformanceData(supabase: any) {
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      views,
      reading_time,
      engagement_score,
      created_at
    `)
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(10)

  return (posts || []).map((post) => ({
    id: post.id,
    title: post.title,
    views: post.views || 0,
    readingTime: post.reading_time || 5,
    completionRate: Math.random() * 100, // Mock data - would need actual tracking
    engagement: post.engagement_score || Math.random() * 100,
  }))
}

async function getSubscriptionMetrics(supabase: any) {
  const [{ data: subscriptions }, { data: plans }, { count: totalUsers }, { count: activeSubscriptions }] =
    await Promise.all([
      supabase.from("user_subscriptions").select("status, plan_id, created_at, cancelled_at").eq("status", "active"),
      supabase.from("subscription_plans").select("id, name, price"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    ])

  const conversionRate = totalUsers > 0 ? ((activeSubscriptions || 0) / totalUsers) * 100 : 0
  const churnRate = 5.2 // Mock data - would calculate from actual cancellations

  // Calculate MRR
  const mrr = (subscriptions || []).reduce((total, sub) => {
    const plan = plans?.find((p) => p.id === sub.plan_id)
    return total + (plan?.price || 0)
  }, 0)

  // Plan distribution
  const planCounts = new Map()
  subscriptions?.forEach((sub) => {
    const plan = plans?.find((p) => p.id === sub.plan_id)
    if (plan) {
      planCounts.set(plan.name, (planCounts.get(plan.name) || 0) + 1)
    }
  })

  const planDistribution = Array.from(planCounts.entries()).map(([plan, count]) => ({
    plan,
    count,
    percentage: (count / (activeSubscriptions || 1)) * 100,
  }))

  return {
    conversionRate,
    churnRate,
    mrr,
    planDistribution,
  }
}

async function getLearningAnalytics(supabase: any) {
  const [{ data: learningPaths }, { data: userProgress }, { count: totalLearners }] = await Promise.all([
    supabase
      .from("learning_paths")
      .select(`
        id,
        title,
        modules:learning_modules(id)
      `)
      .eq("is_active", true),
    supabase.from("user_progress").select("user_id, progress_percentage, module_id"),
    supabase.from("user_progress").select("user_id", { count: "exact", head: true }).not("user_id", "is", null),
  ])

  const totalProgress = userProgress?.reduce((sum, p) => sum + p.progress_percentage, 0) || 0
  const averageProgress = userProgress?.length ? totalProgress / userProgress.length : 0

  const completedModules = userProgress?.filter((p) => p.progress_percentage >= 100).length || 0
  const completionRate = userProgress?.length ? (completedModules / userProgress.length) * 100 : 0

  // Popular learning paths
  const pathProgress = new Map()
  userProgress?.forEach((progress) => {
    // This would need proper path-module mapping in real implementation
    const pathId = "mock-path-id"
    if (!pathProgress.has(pathId)) {
      pathProgress.set(pathId, { learners: new Set(), totalProgress: 0, count: 0 })
    }
    const pathData = pathProgress.get(pathId)
    pathData.learners.add(progress.user_id)
    pathData.totalProgress += progress.progress_percentage
    pathData.count++
  })

  const popularPaths = (learningPaths || []).slice(0, 5).map((path) => ({
    title: path.title,
    learners: Math.floor(Math.random() * 50) + 10, // Mock data
    avgProgress: Math.floor(Math.random() * 100),
  }))

  return {
    totalLearners: totalLearners || 0,
    averageProgress,
    completionRate,
    popularPaths,
  }
}

async function getEngagementMetrics(supabase: any) {
  // Mock engagement data - would need proper session tracking
  return {
    dailyActiveUsers: Math.floor(Math.random() * 100) + 50,
    weeklyActiveUsers: Math.floor(Math.random() * 300) + 200,
    monthlyActiveUsers: Math.floor(Math.random() * 800) + 500,
    avgSessionDuration: Math.floor(Math.random() * 20) + 10, // minutes
    bounceRate: Math.floor(Math.random() * 30) + 20, // percentage
  }
}
