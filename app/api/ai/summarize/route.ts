import { type NextRequest, NextResponse } from "next/server"
import { summarizeContent } from "@/lib/ai-lab"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's preferred language
    const { data: profile } = await supabase.from("profiles").select("preferred_language").eq("id", user.id).single()

    const language = profile?.preferred_language || "en"
    const summary = await summarizeContent(content, language)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error in summarize API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
