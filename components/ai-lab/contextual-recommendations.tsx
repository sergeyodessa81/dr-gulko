"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ArrowRight, Clock } from "lucide-react"

interface ContextualRecommendationsProps {
  context: string
  currentActivity: string
  onRecommendationGenerated?: (recommendations: any[]) => void
}

export function ContextualRecommendations({
  context,
  currentActivity,
  onRecommendationGenerated,
}: ContextualRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const generateContextualRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-lab/recommendations/contextual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, currentActivity }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations)
        onRecommendationGenerated?.(data.recommendations)
      }
    } catch (error) {
      console.error("Error generating contextual recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (recommendations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>
              <h4 className="font-medium">Need help with this topic?</h4>
              <p className="text-sm text-muted-foreground">
                Get AI-powered recommendations based on your current activity
              </p>
            </div>
            <Button onClick={generateContextualRecommendations} disabled={loading} size="sm">
              <Lightbulb className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Get Suggestions"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Contextual Suggestions
        </CardTitle>
        <CardDescription>Based on your current activity: {currentActivity}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-3 border rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{rec.recommended_content.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{rec.recommended_content.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.recommended_content.difficulty}
                  </Badge>
                  {rec.recommended_content.estimated_duration && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {rec.recommended_content.estimated_duration}h
                    </Badge>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent">
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
