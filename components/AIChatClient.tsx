"use client"
import { useChat } from "ai/react"
import { useMemo } from "react"
import { parseActionJson } from "@/utils/parseActionJson"

export default function AIChatClient({
  mode = "german",
  tier = "pro",
}: {
  mode?: string
  tier?: "demo" | "pro" | "heavy"
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/ai/chat?mode=${mode}&tier=${tier}`,
  })

  const action = useMemo(() => {
    const last = messages[messages.length - 1]
    if (!last) return null
    return parseActionJson(String(last.content || ""))
  }, [messages])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="border rounded-2xl p-4 h-[60vh] overflow-auto mb-3 bg-white/50">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <div className="text-xs opacity-60">{m.role}</div>
            <div className="whitespace-pre-wrap leading-relaxed">{String(m.content)}</div>
          </div>
        ))}
        {isLoading && <div className="text-sm opacity-60">…thinking</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Frag mich auf Deutsch…"
        />
        <button className="rounded-xl px-4 py-2 border" type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      {action?.action === "anki.queue" && (
        <div className="mt-4 border rounded-xl p-3">
          <div className="font-medium mb-2">Anki preview ({action.cards?.length})</div>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(action.cards, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
