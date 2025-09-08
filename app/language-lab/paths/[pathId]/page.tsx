import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getLearningPath, calculatePathProgress, getNextModule } from "@/lib/ai-lab"
import { ModuleProgress } from "@/components/ai-lab/module-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, BookOpen, Trophy } from "lucide-react"

interface LearningPathPageProps {
  params: Promise<{ pathId: string }>
}

export default async function LearningPathPage({ params }: LearningPathPageProps) {
  const { pathId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const path = await getLearningPath(pathId, user.id)
  if (!path) {
    notFound()
  }

  const progress = path.modules ? calculatePathProgress(path.modules) : 0
  const nextModule = path.modules ? getNextModule(path.modules) : null
  const totalModules = path.modules?.length || 0
  const completedModules = path.modules?.filter((m) => m.progress?.progress_percentage === 100).length || 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/language-lab">
          <ArrowLeft className="h-4 w-4" />
          Back to AI Language-Lab
        </Link>
      </Button>

      {/* Path Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className={getDifficultyColor(path.difficulty_level)}>{path.difficulty_level}</Badge>
              {path.estimated_duration && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {path.estimated_duration}h
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-4xl font-bold text-balance">{path.title}</h1>
            <p className="text-xl text-muted-foreground text-pretty">{path.description}</p>
          </div>

          {progress === 100 && (
            <div className="flex items-center gap-2 text-green-600">
              <Trophy className="h-6 w-6" />
              <span className="font-medium">Completed!</span>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedModules} of {totalModules} modules completed
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{progress}% complete</span>
                {nextModule && <span>Next: {nextModule.title}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Learning Modules</h2>

        {path.modules && path.modules.length > 0 ? (
          <div className="space-y-6">
            {path.modules
              .sort((a, b) => a.module_order - b.module_order)
              .map((module, index) => (
                <div key={module.id} className="relative">
                  {/* Module Number */}
                  <div className="absolute -left-4 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>

                  <div className="ml-8">
                    <ModuleProgress module={module} userId={user.id} />
                  </div>

                  {/* Connection Line */}
                  {index < path.modules!.length - 1 && <div className="absolute -left-2 top-14 h-6 w-0.5 bg-border" />}
                </div>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Modules Available</h3>
              <p className="text-muted-foreground">This learning path is being prepared. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
