import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { markRecommendationViewed } from "@/lib/ai-lab.server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await markRecommendationViewed(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking recommendation as viewed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
