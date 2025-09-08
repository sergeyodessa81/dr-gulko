"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Crown, BookOpen } from "lucide-react"
import type { LearningModule } from "@/lib/ai-lab.server"

interface ModuleProgressProps {
  module: LearningModule
  userId: string
  onProgressUpdate?: () => void
}

export function ModuleProgress({ module, userId, onProgressUpdate }: ModuleProgressProps) {
  const [progress, setProgress] = useState(module.progress?.progress_percentage || 0)
  const [notes, setNotes] = useState(module.progress?.notes || "")
  const [updating, setUpdating] = useState(false)

  const handleProgressUpdate = async (newProgress: number) => {
    setUpdating(true)
    try {
      const response = await fetch("/api/ai-lab/progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: module.id,
          progressPercentage: newProgress,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update progress")
      }

      setProgress(newProgress)
      onProgressUpdate?.()
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleNotesUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch("/api/ai-lab/progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleId: module.id,
          progressPercentage: progress,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update notes")
      }

      onProgressUpdate?.()
    } catch (error) {
      console.error("Error updating notes:", error)
    } finally {
      setUpdating(false)
    }
  }

  const isCompleted = progress >= 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              {isCompleted ? <CheckCircle className="h-5 w-5 text-green-600" /> : <BookOpen className="h-5 w-5" />}
              {module.title}
            </CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {module.is_premium && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Crown className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
            {module.estimated_duration && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {module.estimated_duration}min
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleProgressUpdate(25)}
              disabled={updating || progress >= 25}
            >
              25%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleProgressUpdate(50)}
              disabled={updating || progress >= 50}
            >
              50%
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleProgressUpdate(75)}
              disabled={updating || progress >= 75}
            >
              75%
            </Button>
            <Button
              size="sm"
              onClick={() => handleProgressUpdate(100)}
              disabled={updating || progress >= 100}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete
            </Button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Learning Notes</label>
          <Textarea
            placeholder="Add your notes, insights, or questions about this module..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <Button size="sm" variant="outline" onClick={handleNotesUpdate} disabled={updating}>
            {updating ? "Saving..." : "Save Notes"}
          </Button>
        </div>

        {/* Completion Status */}
        {isCompleted && module.progress?.completed_at && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Module Completed</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Completed on {new Date(module.progress.completed_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
