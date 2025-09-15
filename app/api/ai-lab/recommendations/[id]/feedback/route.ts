import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    if (!rating || !["positive", "negative"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    // Store feedback in the database (you might want to create a feedback table)
    const { error } = await supabase
      .from("ai_recommendations")
      .update({
        recommended_content: {
          ...((await supabase.from("ai_recommendations").select("recommended_content").eq("id", params.id).single())
            .data?.recommended_content || {}),
          user_feedback: { rating, comment, timestamp: new Date().toISOString() },
        },
      })
      .eq("id", params.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error storing feedback:", error)
      return NextResponse.json({ error: "Failed to store feedback" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST /api/ai-lab/recommendations/[id]/feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
