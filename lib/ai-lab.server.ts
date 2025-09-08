import "server-only"
import { createClient } from "@/lib/supabase/server"
import { groqClient } from "./ai/groq-client"
import type { LearningPath, LearningModule, AIRecommendation } from "./types/ai-lab"

async function getLearningPaths(userId?: string, language = "en"): Promise<LearningPath[]> {
  const supabase = await createClient()

  const query = supabase
    .from("learning_paths")
    .select(`
      *,
      modules:learning_modules(
        *,
        progress:user_progress(*)
      )
    `)
    .eq("language", language)
    .eq("is_active", true)
    .order("title")

  const { data: paths, error } = await query

  if (error) {
    console.error("Error fetching learning paths:", error)
    return []
  }

  if (userId && paths) {
    return paths.map((path) => ({
      ...path,
      modules: path.modules?.map((module: any) => ({
        ...module,
        progress: module.progress?.find((p: any) => p.user_id === userId) || null,
      })),
    }))
  }

  return paths || []
}

async function getLearningPath(pathId: string, userId?: string): Promise<LearningPath | null> {
  const supabase = await createClient()

  const { data: path, error } = await supabase
    .from("learning_paths")
    .select(`
      *,
      modules:learning_modules(
        *,
        progress:user_progress(*)
      )
    `)
    .eq("id", pathId)
    .eq("is_active", true)
    .single()

  if (error || !path) {
    return null
  }

  if (userId && path.modules) {
    path.modules = path.modules.map((module: any) => ({
      ...module,
      progress: module.progress?.find((p: any) => p.user_id === userId) || null,
    }))
  }

  return path
}

async function updateUserProgress(
  userId: string,
  moduleId: string,
  progressPercentage: number,
  notes?: string,
): Promise<void> {
  const supabase = await createClient()

  const updateData: any = {
    user_id: userId,
    module_id: moduleId,
    progress_percentage: progressPercentage,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  }

  if (progressPercentage >= 100) {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase.from("user_progress").upsert(updateData, {
    onConflict: "user_id,module_id",
  })

  if (error) {
    throw new Error("Failed to update progress")
  }
}

async function getUserRecommendations(userId: string): Promise<AIRecommendation[]> {
  const supabase = await createClient()

  const { data: recommendations, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }

  return recommendations || []
}

async function generateAIRecommendations(userId: string): Promise<AIRecommendation[]> {
  const supabase = await createClient()

  try {
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select(`
        *,
        module:learning_modules(
          *,
          path:learning_paths(*)
        )
      `)
      .eq("user_id", userId)

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, preferred_language, specialization")
      .eq("id", userId)
      .single()

    const recentActivity = [
      { type: "module_completion", description: "Completed Basic Trauma Surgery module" },
      { type: "content_view", description: "Viewed Orthopedic Procedures article" },
    ]

    const aiRecommendations = await groqClient.generatePersonalizedRecommendations({
      userId,
      userProgress: userProgress || [],
      userProfile: profile,
      recentActivity,
    })

    const recommendationsToInsert = aiRecommendations.map((rec: any) => ({
      user_id: userId,
      recommended_content: {
        type: rec.recommendation_type,
        title: rec.title,
        description: rec.description,
        difficulty: rec.difficulty,
        estimated_duration: rec.estimated_duration,
      },
      recommendation_type: rec.recommendation_type as "learning_path" | "module" | "content",
      confidence_score: rec.confidence_score,
      is_viewed: false,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    const { data: insertedRecommendations, error } = await supabase
      .from("ai_recommendations")
      .insert(recommendationsToInsert)
      .select()

    if (error) {
      console.error("Error inserting AI recommendations:", error)
      return []
    }

    return insertedRecommendations || []
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return []
  }
}

async function summarizeContent(content: string, language = "en"): Promise<string> {
  try {
    return await groqClient.summarizeContent({
      content,
      maxLength: 200,
      language,
    })
  } catch (error) {
    console.error("Error summarizing content:", error)
    return "Summary unavailable."
  }
}

function calculatePathProgress(modules: LearningModule[]): number {
  if (!modules || modules.length === 0) return 0

  const totalProgress = modules.reduce((sum, module) => {
    return sum + (module.progress?.progress_percentage || 0)
  }, 0)

  return Math.round(totalProgress / modules.length)
}

function getNextModule(modules: LearningModule[]): LearningModule | null {
  if (!modules || modules.length === 0) return null

  const sortedModules = modules.sort((a, b) => a.module_order - b.module_order)

  for (const module of sortedModules) {
    if (!module.progress || module.progress.progress_percentage < 100) {
      return module
    }
  }

  return null
}

async function markRecommendationViewed(recommendationId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("ai_recommendations").update({ is_viewed: true }).eq("id", recommendationId)

  if (error) {
    throw new Error("Failed to mark recommendation as viewed")
  }
}

export {
  getLearningPaths,
  calculatePathProgress,
  getNextModule,
  summarizeContent,
  updateUserProgress,
  getUserRecommendations,
  getLearningPath,
  generateAIRecommendations,
  markRecommendationViewed,
}
