import { streamText } from "ai"
import { groq } from "@/lib/ai/groq-client"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Keep only last 10 messages for demo
    const recentMessages = messages.slice(-10)

    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are a concise German teacher for A1–B2 levels. 

Your teaching approach:
- Correct gently and constructively
- Give a short, clear example after corrections
- Add 1 micro-drill (a small practice exercise) at the end
- Keep responses concise and focused
- Use simple, clear German appropriate for the student's level
- Be encouraging and supportive

Format your responses like this:
1. Acknowledge what the student wrote
2. Provide gentle corrections if needed with explanations
3. Give a relevant example
4. End with a micro-drill for practice

Always respond in German unless the student specifically asks for English explanations.`,
      messages: recentMessages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("German demo chat error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
