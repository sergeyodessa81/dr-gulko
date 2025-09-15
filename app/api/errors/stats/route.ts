import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.rpc("get_error_stats", {
      p_user_id: user.id,
    })

    if (error) {
      console.error("Error fetching error stats:", error)
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    const stats = data?.[0] || {
      total_errors: 0,
      resolved_errors: 0,
      resolution_rate: 0,
      common_categories: [],
      weekly_trend: [],
    }

    // Generate improvement recommendations based on common error patterns
    const improvementAreas = []
    const categories = stats.common_categories || []

    if (categories.some((cat: any) => cat.category === "Articles")) {
      improvementAreas.push("Focus on German article system (der, die, das)")
    }
    if (categories.some((cat: any) => cat.category === "Medical Terms")) {
      improvementAreas.push("Review medical terminology distinctions")
    }
    if (categories.some((cat: any) => cat.category === "Verb Conjugation")) {
      improvementAreas.push("Practice verb conjugations in medical contexts")
    }
    if (categories.some((cat: any) => cat.category === "Anatomy")) {
      improvementAreas.push("Study anatomical terminology with visual aids")
    }

    return NextResponse.json({
      totalErrors: stats.total_errors,
      resolvedErrors: stats.resolved_errors,
      resolutionRate: stats.resolution_rate,
      commonCategories: stats.common_categories,
      weeklyTrend: stats.weekly_trend,
      improvementAreas,
    })
  } catch (error) {
    console.error("Error in GET /api/errors/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
