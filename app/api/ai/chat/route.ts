import type { NextRequest } from "next/server"
import { groqClient } from "@/lib/ai/groq-client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqClient.chatStream(messages)) {
            controller.enqueue(new TextEncoder().encode(chunk))
          }
        } catch (error) {
          console.error("Error in chat stream:", error)
          controller.enqueue(new TextEncoder().encode("Sorry, I encountered an error. Please try again."))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
