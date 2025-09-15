"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { MessageList } from "./message-list"
import { InputBar } from "./input-bar"
import { LimitBanner } from "./limit-banner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LabType } from "@/lib/system-prompts"

interface ChatLabProps {
  lab: LabType
  title: string
  description: string
}

const levels = ["A0", "A1", "A2", "B1", "B2", "C1"] as const

export function ChatLab({ lab, title, description }: ChatLabProps) {
  const [level, setLevel] = useState<string>("B1")
  const [isLimited, setIsLimited] = useState(false)
  const [resetAt, setResetAt] = useState<number>(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { lab, level },
    onError: (error) => {
      if (error.message.includes("429")) {
        try {
          const errorData = JSON.parse(error.message)
          setIsLimited(true)
          setResetAt(errorData.resetAt)
        } catch {
          setIsLimited(true)
          setResetAt(Date.now() + 24 * 60 * 60 * 1000)
        }
      }
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-balance">{title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">{description}</p>

        <div className="flex justify-center">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {levels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLimited && <LimitBanner resetAt={resetAt} />}

      <div className="bg-card rounded-2xl border shadow-sm">
        <MessageList messages={messages} />
        <InputBar
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={isLimited}
        />
      </div>
    </div>
  )
}
