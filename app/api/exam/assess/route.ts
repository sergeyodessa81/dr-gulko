import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { getModel } from "@/lib/ai/providers"
import rubric from "@/lib/rubrics/telc-b1-schreiben.json"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return new Response("Text is required", { status: 400 })
    }

    const system = `Evaluate a B1 Schreiben answer using the provided rubric. Return JSON with per-criterion scores and 1–2 line feedback.`
    const user = `RUBRIC:\n${JSON.stringify(rubric)}\n\nANSWER:\n${text}`

    const result = await streamText({
      model: getModel("gpt-5-mini"),
      system,
      messages: [{ role: "user", content: user }],
      temperature: 0.2,
      maxTokens: 400,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Exam assessment API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
