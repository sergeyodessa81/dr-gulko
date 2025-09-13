import { streamText } from "ai"
import { getAIModel } from "@/lib/ai"
import { getSystemPrompt, type LabType, type Level } from "@/lib/system-prompts"
import { getQuotaStatus, incrementQuota, setQuotaCookie, isQuotaExceeded } from "@/lib/quota"
import type { NextRequest } from "next/server"

export const runtime = "edge"

interface ChatRequest {
  lab: LabType
  level?: Level
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
  }>
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { lab, level, messages }: ChatRequest = await req.json()

    // Validate required fields
    if (!lab || !messages) {
      return Response.json({ error: "Missing required fields: lab, messages" }, { status: 400 })
    }

    // Check quota before processing
    const quotaExceeded = await isQuotaExceeded()
    if (quotaExceeded) {
      const quotaStatus = await getQuotaStatus()
      return Response.json(
        {
          error: "Daily limit reached. Please try again later.",
          limit: 10,
          resetAt: quotaStatus.resetAt,
        },
        { status: 429 },
      )
    }

    // Get system prompt for the lab
    const systemPrompt = getSystemPrompt(lab, level)

    // Prepare messages with system prompt
    const messagesWithSystem = [{ role: "system" as const, content: systemPrompt }, ...messages]

    // Get AI model
    const model = getAIModel()

    // Stream the response
    const result = await streamText({
      model,
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Increment quota on first token
    let quotaIncremented = false

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of result.textStream) {
            // Increment quota on first chunk
            if (!quotaIncremented) {
              const updatedQuota = await incrementQuota()
              const cookieHeader = setQuotaCookie(updatedQuota)

              // Send quota update as part of response headers
              // Note: In streaming responses, we can't set headers after streaming starts
              // The quota will be updated on the next request
              quotaIncremented = true
            }

            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    // Create response with quota cookie
    const response = new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })

    // Set quota cookie if incremented
    if (quotaIncremented) {
      const updatedQuota = await incrementQuota()
      const cookieHeader = setQuotaCookie(updatedQuota)
      response.headers.set("Set-Cookie", cookieHeader)
    }

    return response
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
