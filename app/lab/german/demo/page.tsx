"use client";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Trash2, MessageSquare } from "lucide-react"
import Link from "next/link"

const PRESET_PROMPTS = [
  {
    label: "Small talk (A1)",
    text: "Stell dich vor: Name, Herkunft, Hobby.",
  },
  {
    label: "Daily routine (A1–A2)",
    text: "Beschreibe deinen Tag in 5 Sätzen.",
  },
  {
    label: "At the supermarket (A2)",
    text: "Fragen nach Preisen und Angeboten.",
  },
  {
    label: "Apartment search (A2–B1)",
    text: "Schreibe eine kurze Anfrage an einen Vermieter.",
  },
  {
    label: "Job interview (B1)",
    text: "Antworte knapp auf 3 Fragen: Stärken, Schwächen, Motivation.",
  },
  {
    label: "Opinion (B1–B2)",
    text: "Schreibe 5–7 Sätze: Sind soziale Medien nützlich?",
  },
]

export default function GermanDemoPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
    api: "/api/chat/german-demo",
    keepLastMessageOnly: false,
    maxToolRoundtrips: 0,
  })

  // Keep only last 10 messages
  const displayMessages = messages.slice(-10)

  const clearChat = () => {
    setMessages([])
  }

  const insertPreset = (text: string) => {
    setInput(text)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="font-bold">German Demo</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-4xl">
        {/* Demo Banner */}
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">
            Demo mode (General German). No login, limited context.
          </Badge>
          <h1 className="text-2xl font-bold">German AI Teacher Demo</h1>
          <p className="text-muted-foreground">
            Try our AI-powered German teacher. Get corrections, examples, and practice exercises.
          </p>
        </div>

        {/* Preset Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Start Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PRESET_PROMPTS.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 bg-transparent"
                  onClick={() => insertPreset(preset.text)}
                >
                  <div>
                    <div className="font-medium text-xs text-muted-foreground mb-1">{preset.label}</div>
                    <div className="text-sm">{preset.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chat with AI Teacher</CardTitle>
            <Button variant="outline" size="sm" onClick={clearChat} disabled={displayMessages.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto">
              {displayMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation by typing a message or using one of the preset prompts above.</p>
                </div>
              ) : (
                displayMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your German message here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !((input ?? '').trim())}>

                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Demo limitations:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Only last 10 messages are kept in memory</li>
                <li>No user account or progress tracking</li>
                <li>General German only (no medical specialization)</li>
              </ul>
              <p className="pt-2">
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up for free
                </Link>{" "}
                to access the full platform with progress tracking, specialized content, and unlimited chat history.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
