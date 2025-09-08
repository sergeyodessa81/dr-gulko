import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CreditCard, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalUsers: number
    totalPosts: number
    publishedPosts: number
    activeSubscriptions: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      description: `${stats.publishedPosts} published`,
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: CreditCard,
      description: "Paying subscribers",
    },
    {
      title: "Engagement",
      value: Math.round((stats.publishedPosts / Math.max(stats.totalPosts, 1)) * 100),
      icon: TrendingUp,
      description: "% posts published",
      suffix: "%",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              {card.suffix || ""}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
