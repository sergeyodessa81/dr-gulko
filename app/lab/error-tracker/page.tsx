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
  userId: string
  errorType: "grammar" | "vocabulary" | "pronunciation" | "medical_terminology"
  category: string
  description: string
  correctAnswer: string
  userAnswer: string
  context: string
  frequency: number
  lastOccurred: string
  isResolved: boolean
  createdAt: string
}

interface ErrorStats {
  totalErrors: number
  resolvedErrors: number
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

  // Mock data for demonstration
  const mockErrors: LearningError[] = [
    {
      id: "1",
      userId: "user1",
      errorType: "grammar",
      category: "Articles",
      description: "Incorrect article usage with 'Krankenhaus'",
      correctAnswer: "das Krankenhaus",
      userAnswer: "der Krankenhaus",
      context: "Medical facility vocabulary",
      frequency: 3,
      lastOccurred: "2024-01-15T10:30:00Z",
      isResolved: false,
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: "2",
      userId: "user1",
      errorType: "vocabulary",
      category: "Medical Terms",
      description: "Confusion between 'Arthritis' and 'Arthrose'",
      correctAnswer: "Arthritis (inflammation)",
      userAnswer: "Arthrose (inflammation)",
      context: "Joint conditions terminology",
      frequency: 2,
      lastOccurred: "2024-01-14T14:20:00Z",
      isResolved: false,
      createdAt: "2024-01-12T11:15:00Z",
    },
    {
      id: "3",
      userId: "user1",
      errorType: "grammar",
      category: "Verb Conjugation",
      description: "Incorrect past tense of 'haben'",
      correctAnswer: "hatte",
      userAnswer: "habte",
      context: "Patient history description",
      frequency: 1,
      lastOccurred: "2024-01-13T16:45:00Z",
      isResolved: true,
      createdAt: "2024-01-13T16:45:00Z",
    },
    {
      id: "4",
      userId: "user1",
      errorType: "medical_terminology",
      category: "Anatomy",
      description: "Incorrect term for 'spine'",
      correctAnswer: "Wirbelsäule",
      userAnswer: "Rückenknochen",
      context: "Anatomical descriptions",
      frequency: 2,
      lastOccurred: "2024-01-16T09:10:00Z",
      isResolved: false,
      createdAt: "2024-01-14T13:30:00Z",
    },
  ]

  const mockStats: ErrorStats = {
    totalErrors: 8,
    resolvedErrors: 2,
    commonCategories: [
      { category: "Articles", count: 3, percentage: 37.5 },
      { category: "Medical Terms", count: 2, percentage: 25 },
      { category: "Verb Conjugation", count: 2, percentage: 25 },
      { category: "Anatomy", count: 1, percentage: 12.5 },
    ],
    weeklyTrend: [
      { week: "Week 1", errors: 2 },
      { week: "Week 2", errors: 4 },
      { week: "Week 3", errors: 1 },
      { week: "Week 4", errors: 1 },
    ],
    improvementAreas: [
      "Focus on German article system (der, die, das)",
      "Review medical terminology distinctions",
      "Practice verb conjugations in medical contexts",
    ],
  }

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
      // In a real implementation, this would fetch from the database
      setErrors(mockErrors)
      setStats(mockStats)
    } catch (error) {
      console.error("Error loading error data:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsResolved = async (errorId: string) => {
    setErrors((prev) => prev.map((error) => (error.id === errorId ? { ...error, isResolved: true } : error)))
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

  if (!user || loading) return null

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
                    <div className="text-2xl font-bold">
                      {Math.round((stats.resolvedErrors / stats.totalErrors) * 100)}%
                    </div>
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
                <Card key={error.id} className={error.isResolved ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-2xl">{getErrorTypeIcon(error.errorType)}</div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getErrorTypeColor(error.errorType)}>
                              {error.errorType.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline">{error.category}</Badge>
                            {error.frequency > 1 && (
                              <Badge variant="destructive" className="text-xs">
                                {error.frequency}x
                              </Badge>
                            )}
                            {error.isResolved && (
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
                                <span className="bg-red-50 px-2 py-1 rounded">{error.userAnswer}</span>
                              </div>
                              <div>
                                <span className="font-medium text-green-600">Correct answer: </span>
                                <span className="bg-green-50 px-2 py-1 rounded">{error.correctAnswer}</span>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <span className="font-medium">Context: </span>
                              {error.context}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Last occurred: {new Date(error.lastOccurred).toLocaleDateString()}</span>
                            {!error.isResolved && (
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
                                style={{ width: `${(week.errors / 5) * 100}%` }}
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
            {stats && (
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
      </div>
    </div>
  )
}
