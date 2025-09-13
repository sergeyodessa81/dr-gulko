import { streamText } from "ai"
import { modelFor } from "@/lib/ai"
import { systemPrompts, type LabType } from "@/lib/system-prompts"
import { getQuotaStatus, createQuotaCookie } from "@/lib/quota"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { lab, level, messages } = await req.json()

    // Validate lab type
    if (!systemPrompts[lab as LabType]) {
      return Response.json({ error: "Invalid lab type" }, { status: 400 })
    }

    // Check quota
    const quota = await getQuotaStatus()
    if (quota.count >= 10) {
      return Response.json(
        {
          error: "Daily limit reached",
          limit: 10,
          resetAt: quota.resetAt,
        },
        { status: 429 },
      )
    }

    // Build system prompt
    const systemPrompt = systemPrompts[lab as LabType](level)
    const allMessages = [{ role: "system", content: systemPrompt }, ...messages]

    // Stream response
    const result = streamText({
      model: modelFor(),
      messages: allMessages,
    })

    // Increment quota on first token
    let quotaIncremented = false
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          if (!quotaIncremented) {
            quotaIncremented = true
            // This will be handled by setting the cookie in the response
          }
          controller.enqueue(new TextEncoder().encode(chunk))
        }
        controller.close()
      },
    })

    // Create response with updated quota cookie
    const response = new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Set-Cookie": `dg_free_uses=${createQuotaCookie({
          count: quota.count + 1,
          resetAt: quota.resetAt,
        })}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}`,
      },
    })

    return response
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
