"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Sparkles, Copy, Check } from "lucide-react"

export function ContentSummarizer() {
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!response.ok) throw new Error("Failed to summarize")

      const { summary: generatedSummary } = await response.json()
      setSummary(generatedSummary)
    } catch (error) {
      console.error("Error summarizing content:", error)
      setSummary("Failed to generate summary. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!summary) return

    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          AI Content Summarizer
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content to Summarize</label>
          <Textarea
            placeholder="Paste your medical article, research paper, or educational content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{content.length} characters</span>
            <Button onClick={handleSummarize} disabled={!content.trim() || isLoading} size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {isLoading ? "Summarizing..." : "Summarize"}
            </Button>
          </div>
        </div>

        {summary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI-Generated Summary</label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  AI-powered
                </Badge>
                <Button onClick={handleCopy} size="sm" variant="outline" className="gap-1 bg-transparent">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-pretty leading-relaxed">{summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
