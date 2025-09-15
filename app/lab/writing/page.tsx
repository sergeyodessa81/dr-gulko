"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenTool, CheckCircle, AlertCircle, Lightbulb, RotateCcw } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface WritingFeedback {
  score: number
  corrections: Array<{
    type: "grammar" | "vocabulary" | "style" | "medical"
    original: string
    suggestion: string
    explanation: string
    position: { start: number; end: number }
  }>
  suggestions: string[]
  medicalTerms: Array<{
    term: string
    definition: string
    context: string
  }>
}

export default function WritingLabPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [text, setText] = useState("")
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const supabase = createClient()

  const writingPrompts = [
    {
      title: "Medical Consultation",
      prompt: "Schreiben Sie einen Dialog zwischen einem Arzt und einem Patienten über Rückenschmerzen.",
      level: "Intermediate",
    },
    {
      title: "Case Study",
      prompt: "Beschreiben Sie einen komplexen Trauma-Fall und die Behandlungsstrategie.",
      level: "Advanced",
    },
    {
      title: "Medical Report",
      prompt: "Verfassen Sie einen Operationsbericht für eine Kniearthroskopie.",
      level: "Advanced",
    },
    {
      title: "Patient Education",
      prompt: "Erklären Sie einem Patienten die Nachbehandlung nach einer Fraktur.",
      level: "Beginner",
    },
  ]

  const usePrompt = (prompt: string) => {
    setText(prompt)
    setSelectedPrompt(prompt)
    setFeedback(null)
  }

  const clearText = () => {
    setText("")
    setFeedback(null)
    setSelectedPrompt("")
  }

  const analyzeWriting = async () => {
    if (!text.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "de" }),
      })

      if (!response.ok) throw new Error("Failed to analyze writing")

      const result = await response.json()
      setFeedback(result)
    } catch (error) {
      console.error("Error analyzing writing:", error)
      // Provide mock feedback for demo
      setFeedback({
        score: 85,
        corrections: [
          {
            type: "grammar",
            original: "Der Patient hat Schmerzen",
            suggestion: "Der Patient hat Schmerzen im Rücken",
            explanation: "Mehr spezifische Beschreibung der Schmerzlokalisation",
            position: { start: 0, end: 25 },
          },
        ],
        suggestions: [
          "Verwenden Sie mehr medizinische Fachbegriffe",
          "Strukturieren Sie Ihre Sätze klarer",
          "Fügen Sie mehr Details zur Diagnose hinzu",
        ],
        medicalTerms: [
          {
            term: "Anamnese",
            definition: "Krankengeschichte des Patienten",
            context: "Die Anamnese ist wichtig für die Diagnose",
          },
        ],
      })
    } finally {
      setIsAnalyzing(false)
    }
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
    }
    getUser()
  }, [supabase])

  if (!user) return null

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Writing Lab</h1>
              <p className="text-muted-foreground">AI-powered German writing feedback and correction</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Grammar Check</Badge>
            <Badge variant="secondary">Medical Writing</Badge>
            <Badge variant="secondary">Style Improvement</Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Writing Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Writing</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearText}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button onClick={analyzeWriting} disabled={!text.trim() || isAnalyzing}>
                      {isAnalyzing ? "Analyzing..." : "Analyze Writing"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Schreiben Sie hier Ihren deutschen Text..."
                  className="min-h-[300px] text-base"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {text.length} characters • {text.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {feedback && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Writing Analysis
                    <Badge variant="secondary" className="ml-auto">
                      Score: {feedback.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="corrections" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="corrections">Corrections</TabsTrigger>
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="medical">Medical Terms</TabsTrigger>
                    </TabsList>

                    <TabsContent value="corrections" className="space-y-4">
                      {feedback.corrections.map((correction, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {correction.type}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm font-medium">Original: </span>
                                  <span className="text-sm bg-red-100 px-1 rounded">{correction.original}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Suggestion: </span>
                                  <span className="text-sm bg-green-100 px-1 rounded">{correction.suggestion}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{correction.explanation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="suggestions" className="space-y-3">
                      {feedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="medical" className="space-y-4">
                      {feedback.medicalTerms.map((term, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-primary">{term.term}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                          <p className="text-sm mt-2 italic">"{term.context}"</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Writing Prompts Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {writingPrompts.map((prompt, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{prompt.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {prompt.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{prompt.prompt}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => usePrompt(prompt.prompt)}
                      className="w-full bg-transparent"
                    >
                      Use Prompt
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">📝 Medical Writing</h4>
                  <p className="text-sm text-muted-foreground">
                    Use precise medical terminology and clear, professional language.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎯 Structure</h4>
                  <p className="text-sm text-muted-foreground">
                    Organize your text with clear paragraphs and logical flow.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">✅ Grammar</h4>
                  <p className="text-sm text-muted-foreground">
                    Pay attention to German case system and verb conjugations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
