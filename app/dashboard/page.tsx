import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PushNotifications } from "@/components/pwa/push-notifications"
import { AIRecommendations } from "@/components/ai-lab/ai-recommendations"
import { getUserRecommendations } from "@/lib/ai-lab.server"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const recommendations = await getUserRecommendations(data.user.id)

  // Get user progress from learning modules
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("progress_percentage")
    .eq("user_id", data.user.id)

  const averageProgress =
    userProgress && userProgress.length > 0
      ? Math.round(userProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / userProgress.length)
      : 0

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "User"}!</h1>
          <p className="text-muted-foreground">Access your personalized medical education platform</p>
        </div>
        <form action={handleSignOut}>
          <Button variant="outline" type="submit">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{averageProgress}%</p>
            <p className="text-sm text-muted-foreground">
              {averageProgress === 0 ? "Complete your first module" : "Keep up the great work!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{profile?.role || "Free"}</p>
            <p className="text-sm text-muted-foreground">Current plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{recommendations.length}</p>
            <p className="text-sm text-muted-foreground">
              {recommendations.length === 0 ? "Generate your first recommendations" : "Personalized suggestions"}
            </p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 lg:col-span-3">
          <AIRecommendations userId={data.user.id} />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <PushNotifications />
        </div>
      </div>
    </div>
  )
}
