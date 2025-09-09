import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { groqClient } from "@/lib/ai/groq-client"

export async function POST(request: NextRequest) {
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
    const { context, currentActivity } = body

    // Get user's recent errors for contextual recommendations
    const { data: recentErrors } = await supabase
      .from("learning_errors")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .order("last_occurred", { ascending: false })
      .limit(5)

    // Get user profile and progress
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, preferred_language, specialization")
      .eq("id", user.id)
      .single()

    const { data: userProgress } = await supabase
      .from("user_progress")
      .select(`
        *,
        module:learning_modules(
          *,
          path:learning_paths(*)
        )
      `)
      .eq("user_id", user.id)

    // Generate contextual recommendations based on current activity and errors
    const contextualRecommendations = await groqClient.generatePersonalizedRecommendations({
      userId: user.id,
      userProgress: userProgress || [],
      userProfile: profile,
      recentActivity: [
        { type: "current_activity", description: currentActivity },
        { type: "context", description: context },
        ...(recentErrors || []).map((error) => ({
          type: "error_pattern",
          description: `Recurring ${error.error_type} error: ${error.description}`,
        })),
      ],
    })

    // Store contextual recommendations with shorter expiry
    const recommendationsToInsert = contextualRecommendations.map((rec: any) => ({
      user_id: user.id,
      recommended_content: {
        ...rec,
        contextual: true,
        triggered_by: context,
      },
      recommendation_type: rec.recommendation_type as "learning_path" | "module" | "content",
      confidence_score: rec.confidence_score,
      is_viewed: false,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days for contextual
    }))

    const { data: insertedRecommendations, error } = await supabase
      .from("ai_recommendations")
      .insert(recommendationsToInsert)
      .select()

    if (error) {
      console.error("Error inserting contextual recommendations:", error)
      return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
    }

    return NextResponse.json({ recommendations: insertedRecommendations || [] })
  } catch (error) {
    console.error("Error in POST /api/ai-lab/recommendations/contextual:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
