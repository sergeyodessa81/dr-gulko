import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const { error } = await supabase
      .from("learning_errors")
      .update({ is_resolved: true, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error resolving error:", error)
      return NextResponse.json({ error: "Failed to resolve error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in PATCH /api/errors/[id]/resolve:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
