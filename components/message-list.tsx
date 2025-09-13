import type { Message } from "ai"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Start a conversation to begin learning German!</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
          <Card
            className={cn(
              "max-w-[80%] p-4",
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            <div className="text-sm font-medium mb-2 opacity-70">{message.role === "user" ? "You" : "Teacher"}</div>
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </Card>
        </div>
      ))}
    </div>
  )
}
