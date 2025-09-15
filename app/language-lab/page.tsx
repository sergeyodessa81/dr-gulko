import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getLearningPaths } from "@/lib/ai-lab.server"
import { LearningPathCard } from "@/components/ai-lab/learning-path-card"
import { AIRecommendations } from "@/components/ai-lab/ai-recommendations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Target, TrendingUp } from "lucide-react"

export default async function LanguageLabPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile for language preference
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_language, role")
    .eq("id", user.id)
    .single()

  const language = profile?.preferred_language || "en"
  const learningPaths = await getLearningPaths(user.id, language)

  // Calculate user's overall progress
  const totalModules = learningPaths.reduce((sum, path) => sum + (path.modules?.length || 0), 0)
  const completedModules = learningPaths.reduce(
    (sum, path) => sum + (path.modules?.filter((m) => m.progress?.progress_percentage === 100).length || 0),
    0,
  )
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold">AI Language-Lab</h1>
            <p className="text-muted-foreground">Personalized medical education powered by artificial intelligence</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{learningPaths.length}</div>
                  <div className="text-xs text-muted-foreground">Learning Paths</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{totalModules}</div>
                  <div className="text-xs text-muted-foreground">Total Modules</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{completedModules}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{overallProgress}%</div>
                  <div className="text-xs text-muted-foreground">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Learning Paths */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Learning Paths</h2>
            {learningPaths.length > 0 ? (
              <div className="grid gap-6">
                {learningPaths.map((path) => (
                  <LearningPathCard key={path.id} path={path} showProgress={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Learning Paths Available</h3>
                  <p className="text-muted-foreground">
                    Learning paths are being prepared for your language preference. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Recommendations Sidebar */}
        <div className="space-y-6">
          <AIRecommendations userId={user.id} />

          {/* Feature Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI-Powered Features</CardTitle>
              <CardDescription>Enhance your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Adaptive Learning</h4>
                  <p className="text-sm text-muted-foreground">AI adjusts content difficulty based on your progress</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium">Smart Recommendations</h4>
                  <p className="text-sm text-muted-foreground">Personalized content suggestions for optimal learning</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Progress Tracking</h4>
                  <p className="text-sm text-muted-foreground">Detailed analytics on your learning journey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
