import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Trophy, ArrowRight } from "lucide-react"
import { calculatePathProgress, getNextModule } from "@/lib/ai-lab.server"
import type { LearningPath } from "@/lib/ai-lab.server"

interface LearningPathCardProps {
  path: LearningPath
  showProgress?: boolean
}

export function LearningPathCard({ path, showProgress = false }: LearningPathCardProps) {
  const progress = showProgress && path.modules ? calculatePathProgress(path.modules) : 0
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
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{path.title}</CardTitle>
            <CardDescription className="text-pretty">{path.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(path.difficulty_level)}>{path.difficulty_level}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{totalModules} modules</span>
          </div>
          {path.estimated_duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{path.estimated_duration}h</span>
            </div>
          )}
          {showProgress && completedModules === totalModules && totalModules > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <Trophy className="h-4 w-4" />
              <span>Completed</span>
            </div>
          )}
        </div>

        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {completedModules} of {totalModules} modules completed
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {nextModule ? (
            <div className="text-sm text-muted-foreground">Next: {nextModule.title}</div>
          ) : showProgress && completedModules === totalModules ? (
            <div className="text-sm text-green-600 font-medium">Path completed!</div>
          ) : (
            <div />
          )}

          <Button asChild variant={showProgress && progress > 0 ? "default" : "outline"}>
            <Link href={`/language-lab/paths/${path.id}`}>
              {showProgress && progress > 0 ? "Continue" : "Start Learning"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
