import { type NextRequest, NextResponse } from "next/server"
import { updateUserProgress } from "@/lib/ai-lab.server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { moduleId, progressPercentage, notes } = await request.json()

    if (!moduleId || typeof progressPercentage !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await updateUserProgress(user.id, moduleId, progressPercentage, notes)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
