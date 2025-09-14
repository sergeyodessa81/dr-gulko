"use client"

import { useChat } from "ai"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MessageList } from "./MessageList"
import { InputBar } from "./InputBar"
import { LimitBanner } from "./LimitBanner"
import { RotateCcw } from "lucide-react"
import type { LabType, Level } from "@/lib/system-prompts"

interface ChatLabProps {
  lab: LabType
  title: string
  description: string
  helpText?: string
  defaultLevel?: Level
}

interface QuotaError {
  error: string
  limit: number
  resetAt: number
}

export function ChatLab({ lab, title, description, helpText, defaultLevel = "B1" }: ChatLabProps) {
  const [level, setLevel] = useState<Level>(defaultLevel)
  const [quotaError, setQuotaError] = useState<QuotaError | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, setMessages } = useChat({
    api: "/api/chat",
    body: { lab, level },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message)
        if (errorData.limit) {
          setQuotaError(errorData)
        }
      } catch {
        console.error("Chat error:", error)
      }
    },
    onResponse: () => {
      // Clear quota error on successful response
      setQuotaError(null)
    },
  })

  const handleClearChat = () => {
    setMessages([])
    setQuotaError(null)
  }

  const handleSend = (message: string) => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: { value: message },
    } as any

    handleInputChange(syntheticEvent)
    setTimeout(() => handleSubmit(syntheticEvent), 0)
  }

  const isDisabled = isLoading || !!quotaError

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-balance">{title}</CardTitle>
              <p className="text-muted-foreground mt-1 text-pretty">{description}</p>
              {helpText && <p className="text-sm text-muted-foreground/80 mt-2 text-pretty">{helpText}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Select value={level} onValueChange={(value: Level) => setLevel(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A0">A0</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleClearChat} disabled={messages.length === 0}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {quotaError && <LimitBanner resetAt={quotaError.resetAt} limit={quotaError.limit} />}

          <MessageList messages={messages} isLoading={isLoading} />

          <InputBar
            onSend={handleSend}
            disabled={isDisabled}
            placeholder={`Type your message in German (${level} level)...`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
