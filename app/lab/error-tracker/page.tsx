"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, Target, BookOpen } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface LearningError {
  id: string
  user_id: string
  error_type: "grammar" | "vocabulary" | "pronunciation" | "medical_terminology"
  category: string
  description: string
  correct_answer: string
  user_answer: string
  context: string
  frequency: number
  last_occurred: string
  is_resolved: boolean
  created_at: string
}

interface ErrorStats {
  totalErrors: number
  resolvedErrors: number
  resolutionRate: number
  commonCategories: Array<{ category: string; count: number; percentage: number }>
  weeklyTrend: Array<{ week: string; errors: number }>
  improvementAreas: string[]
}

export default function ErrorTrackerPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [errors, setErrors] = useState<LearningError[]>([])
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        redirect("/auth/login")
      }
      setUser(user)
      loadErrorData()
    }
    getUser()
  }, [supabase])

  const loadErrorData = async () => {
    setLoading(true)
    try {
      const [errorsResponse, statsResponse] = await Promise.all([fetch("/api/errors"), fetch("/api/errors/stats")])

      if (errorsResponse.ok) {
        const errorsData = await errorsResponse.json()
        setErrors(errorsData.errors || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error loading error data:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsResolved = async (errorId: string) => {
    try {
      const response = await fetch(`/api/errors/${errorId}/resolve`, {
        method: "PATCH",
      })

      if (response.ok) {
        setErrors((prev) => prev.map((error) => (error.id === errorId ? { ...error, is_resolved: true } : error)))
        // Reload stats to reflect the change
        loadErrorData()
      }
    } catch (error) {
      console.error("Error marking error as resolved:", error)
    }
  }

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return "📝"
      case "vocabulary":
        return "📚"
      case "pronunciation":
        return "🗣️"
      case "medical_terminology":
        return "🏥"
      default:
        return "❓"
    }
  }

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case "grammar":
        return "bg-blue-100 text-blue-800"
      case "vocabulary":
        return "bg-green-100 text-green-800"
      case "pronunciation":
        return "bg-purple-100 text-purple-800"
      case "medical_terminology":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredErrors =
    selectedCategory === "all" ? errors : errors.filter((error) => error.category === selectedCategory)

  const categories = ["all", ...Array.from(new Set(errors.map((error) => error.category)))]

  if (!user || loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading error tracking data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Error Tracker</h1>
              <p className="text-muted-foreground">Track and analyze your learning mistakes</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Pattern Recognition</Badge>
            <Badge variant="secondary">Progress Tracking</Badge>
            <Badge variant="secondary">Personalized Feedback</Badge>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalErrors}</div>
                    <div className="text-xs text-muted-foreground">Total Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.resolvedErrors}</div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{Math.round(stats.resolutionRate)}%</div>
                    <div className="text-xs text-muted-foreground">Resolution Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{stats.commonCategories.length}</div>
                    <div className="text-xs text-muted-foreground">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {errors.length === 0 && !loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Errors Tracked Yet</h3>
              <p className="text-muted-foreground">
                Start using the AI Teacher, Writing Lab, or Mock Tests to begin tracking your learning progress and
                errors.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="errors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="errors">Error Log</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="improvement">Improvement</TabsTrigger>
            </TabsList>

            <TabsContent value="errors" className="space-y-4">
              {/* Category Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Error List */}
              <div className="space-y-4">
                {filteredErrors.map((error) => (
                  <Card key={error.id} className={error.is_resolved ? "opacity-60" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-2xl">{getErrorTypeIcon(error.error_type)}</div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className={getErrorTypeColor(error.error_type)}>
                                {error.error_type.replace("_", " ")}
                              </Badge>
                              <Badge variant="outline">{error.category}</Badge>
                              {error.frequency > 1 && (
                                <Badge variant="destructive" className="text-xs">
                                  {error.frequency}x
                                </Badge>
                              )}
                              {error.is_resolved && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  Resolved
                                </Badge>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">{error.description}</h4>
                              <div className="grid gap-2 md:grid-cols-2 text-sm">
                                <div>
                                  <span className="font-medium text-red-600">Your answer: </span>
                                  <span className="bg-red-50 px-2 py-1 rounded">{error.user_answer}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-green-600">Correct answer: </span>
                                  <span className="bg-green-50 px-2 py-1 rounded">{error.correct_answer}</span>
                                </div>
                              </div>
                              {error.context && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <span className="font-medium">Context: </span>
                                  {error.context}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Last occurred: {new Date(error.last_occurred).toLocaleDateString()}</span>
                              {!error.is_resolved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAsResolved(error.id)}
                                  className="gap-1"
                                >
                                  <Target className="h-3 w-3" />
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              {stats && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Error Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stats.commonCategories.map((category) => (
                        <div key={category.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category.category}</span>
                            <span className="text-sm text-muted-foreground">
                              {category.count} errors ({category.percentage}%)
                            </span>
                          </div>
                          <Progress value={category.percentage} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.weeklyTrend.map((week) => (
                          <div key={week.week} className="flex items-center justify-between">
                            <span>{week.week}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${Math.min((week.errors / 5) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{week.errors}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="improvement" className="space-y-6">
              {stats && stats.improvementAreas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Improvement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{area}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Practice Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">📝 Grammar Drills</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Practice German articles and verb conjugations with focused exercises.
                      </p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Start Practice
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">🏥 Medical Vocabulary</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Review medical terminology with flashcards and context examples.
                      </p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Review Terms
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
