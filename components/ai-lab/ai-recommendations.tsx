"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, ArrowRight, X } from "lucide-react"

interface AIRecommendation {
  id: string
  user_id: string
  recommended_content: any
  recommendation_type: "learning_path" | "module" | "content"
  confidence_score: number
  is_viewed: boolean
  created_at: string
  expires_at: string
}

interface AIRecommendationsProps {
  userId: string
}

export function AIRecommendations({ userId }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [userId])

  const loadRecommendations = async () => {
    try {
      const response = await fetch("/api/ai-lab/recommendations")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRecommendations = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/ai-lab/recommendations/generate", {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setRecommendations((prev) => [...data.recommendations, ...prev])
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDismissRecommendation = async (recommendationId: string) => {
    try {
      const response = await fetch(`/api/ai-lab/recommendations/${recommendationId}/viewed`, {
        method: "PATCH",
      })
      if (response.ok) {
        setRecommendations((prev) => prev.filter((rec) => rec.id !== recommendationId))
      }
    } catch (error) {
      console.error("Error dismissing recommendation:", error)
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "learning_path":
        return "🎯"
      case "module":
        return "📚"
      case "content":
        return "📄"
      default:
        return "💡"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading recommendations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Personalized learning suggestions powered by AI</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateRecommendations}
            disabled={generating}
            className="gap-2 bg-transparent"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">No recommendations available yet.</div>
            <Button onClick={handleGenerateRecommendations} disabled={generating}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </div>
        ) : (
          recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="relative p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all"
            >
              <button
                onClick={() => handleDismissRecommendation(recommendation.id)}
                className="absolute top-2 right-2 p-1 hover:bg-background rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>

              <div className="space-y-3 pr-6">
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getRecommendationIcon(recommendation.recommendation_type)}</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{recommendation.recommended_content.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(recommendation.confidence_score * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {recommendation.recommended_content.description}
                    </p>

                    <div className="flex items-center gap-2">
                      {recommendation.recommended_content.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {recommendation.recommended_content.difficulty}
                        </Badge>
                      )}
                      {recommendation.recommended_content.estimated_duration && (
                        <Badge variant="outline" className="text-xs">
                          {recommendation.recommended_content.estimated_duration}h
                        </Badge>
                      )}
                      {recommendation.recommended_content.is_premium && (
                        <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">AI-powered recommendation</div>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    Explore
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
