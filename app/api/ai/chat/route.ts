import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { baseSystem, modePrompts } from "@/lib/system-prompts"
import { getModel, pickModel } from "@/lib/ai"
import germanFew from "@/lib/fewshots/german.json"
import editorFew from "@/lib/fewshots/editor.json"
import examFew from "@/lib/fewshots/exam-assessor.json"
import { retrieve } from "@/lib/rag"

export const runtime = "edge"

const fewMap: Record<string, any> = {
  german: germanFew,
  editor: editorFew,
  "exam-assessor": examFew,
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const mode = (url.searchParams.get("mode") || "german").toLowerCase()
    const tier = (url.searchParams.get("tier") || "pro") as "demo" | "pro" | "heavy"
    const body = await req.json()

    const system = `${baseSystem}\n\n[Mode:${mode}] ${modePrompts[mode as keyof typeof modePrompts] ?? ""}`

    const few = fewMap[mode] ? [{ role: "system" as const, content: JSON.stringify(fewMap[mode]) }] : []

    const ctx = await retrieve(body?.messages?.at(-1)?.content || "", { mode })
    const contextMsg = ctx ? [{ role: "system" as const, content: `Context:\n${ctx}` }] : []

    const model = getModel(pickModel(mode, tier))

    const result = await streamText({
      model,
      system,
      messages: [...few, ...contextMsg, ...(body?.messages || [])],
      temperature: 0.2,
      maxTokens: tier === "demo" ? 300 : 600,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Enhanced chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
