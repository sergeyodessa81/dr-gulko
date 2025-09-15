import { type NextRequest, NextResponse } from "next/server"
import { reactivateSubscription } from "@/lib/subscription.server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing subscription ID" }, { status: 400 })
    }

    await reactivateSubscription(subscriptionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reactivating subscription:", error)
    return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
  }
}
