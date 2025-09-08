"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, Users, BookOpen, CreditCard, Brain } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics"

interface AnalyticsChartsProps {
  data: AnalyticsData
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted))", "hsl(var(--secondary))"]

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.engagementMetrics.dailyActiveUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.subscriptionMetrics.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.learningAnalytics.averageProgress.toFixed(0)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +5.2% this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.subscriptionMetrics.mrr.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Daily new user registrations over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [value, name === "newUsers" ? "New Users" : "Total Users"]}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Most viewed and engaging posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.contentPerformance.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.views.toLocaleString()} views</span>
                    <span>{post.readingTime}min read</span>
                    <span>{post.engagement.toFixed(0)}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Subscription Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Active subscribers by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.subscriptionMetrics.planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {data.subscriptionMetrics.planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} subscribers`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {data.subscriptionMetrics.planDistribution.map((plan, index) => (
                <div key={plan.plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm">{plan.plan}</span>
                  </div>
                  <Badge variant="outline">{plan.percentage.toFixed(1)}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Analytics</CardTitle>
          <CardDescription>AI Language-Lab performance and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion Rate</span>
                <span className="text-sm text-muted-foreground">
                  {data.learningAnalytics.completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={data.learningAnalytics.completionRate} className="h-2" />

              <div className="grid gap-3 pt-4">
                <h4 className="text-sm font-medium">Popular Learning Paths</h4>
                {data.learningAnalytics.popularPaths.map((path) => (
                  <div key={path.title} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{path.title}</p>
                      <p className="text-xs text-muted-foreground">{path.learners} active learners</p>
                    </div>
                    <Badge variant="outline">{path.avgProgress}% avg</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Total Learners</p>
                    <p className="text-2xl font-bold">{data.learningAnalytics.totalLearners}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Average Progress</p>
                    <p className="text-2xl font-bold">{data.learningAnalytics.averageProgress.toFixed(0)}%</p>
                  </div>
                  <Brain className="h-8 w-8 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>Platform usage and activity metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Session Duration</p>
              <p className="text-2xl font-bold">{data.engagementMetrics.avgSessionDuration}min</p>
              <p className="text-xs text-muted-foreground">Average per session</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Weekly Active Users</p>
              <p className="text-2xl font-bold">{data.engagementMetrics.weeklyActiveUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Bounce Rate</p>
              <p className="text-2xl font-bold">{data.engagementMetrics.bounceRate}%</p>
              <p className="text-xs text-muted-foreground">Single page visits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
