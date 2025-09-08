import { type NextRequest, NextResponse } from "next/server"
import { syncNotionDatabase } from "@/lib/sync/notion"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(cookies())

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { databaseId } = await request.json()

    if (!databaseId) {
      return NextResponse.json({ error: "Database ID required" }, { status: 400 })
    }

    const result = await syncNotionDatabase(databaseId)

    // Log sync activity
    await supabase.from("event_logs").insert({
      type: "notion_sync",
      user_id: user.id,
      meta: {
        database_id: databaseId,
        success: result.success,
        results: result.results || [],
        error: result.error,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Notion sync API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
