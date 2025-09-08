import { createClient } from "@/lib/supabase/server"
import { groqClient } from "./ai/groq-client"

export interface LearningPath {
  id: string
  title: string
  description: string | null
  difficulty_level: "beginner" | "intermediate" | "advanced"
  estimated_duration: number | null
  language: "en" | "de" | "ru" | "uk"
  is_active: boolean
  created_at: string
  updated_at: string
  modules?: LearningModule[]
  progress?: UserProgress[]
}

export interface LearningModule {
  id: string
  path_id: string
  title: string
  description: string | null
  content: string
  module_order: number
  estimated_duration: number | null
  is_premium: boolean
  created_at: string
  updated_at: string
  progress?: UserProgress
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  completed_at: string | null
  progress_percentage: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AIRecommendation {
  id: string
  user_id: string
  recommended_content: any
  recommendation_type: "learning_path" | "module" | "content"
  confidence_score: number
  is_viewed: boolean
  created_at: string
  expires_at: string
}

export async function getLearningPaths(userId?: string, language = "en"): Promise<LearningPath[]> {
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

  // If user is provided, filter progress for that user
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

export async function getLearningPath(pathId: string, userId?: string): Promise<LearningPath | null> {
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

  // Filter progress for specific user
  if (userId && path.modules) {
    path.modules = path.modules.map((module: any) => ({
      ...module,
      progress: module.progress?.find((p: any) => p.user_id === userId) || null,
    }))
  }

  return path
}

export async function getLearningModule(moduleId: string, userId?: string): Promise<LearningModule | null> {
  const supabase = await createClient()

  const { data: module, error } = await supabase
    .from("learning_modules")
    .select(`
      *,
      progress:user_progress(*)
    `)
    .eq("id", moduleId)
    .single()

  if (error || !module) {
    return null
  }

  // Filter progress for specific user
  if (userId && module.progress) {
    module.progress = module.progress.find((p: any) => p.user_id === userId) || null
  }

  return module
}

export async function updateUserProgress(
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

export async function getUserRecommendations(userId: string): Promise<AIRecommendation[]> {
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

export async function generateAIRecommendations(userId: string): Promise<AIRecommendation[]> {
  const supabase = await createClient()

  try {
    // Get user's current progress
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

    // Get user's profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, preferred_language, specialization")
      .eq("id", userId)
      .single()

    // Get recent activity (simplified for now)
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

    // Convert AI recommendations to database format
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
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }))

    // Insert recommendations into database
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

export async function summarizeContent(content: string, language = "en"): Promise<string> {
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

export function calculatePathProgress(modules: LearningModule[]): number {
  if (!modules || modules.length === 0) return 0

  const totalProgress = modules.reduce((sum, module) => {
    return sum + (module.progress?.progress_percentage || 0)
  }, 0)

  return Math.round(totalProgress / modules.length)
}

export function getNextModule(modules: LearningModule[]): LearningModule | null {
  if (!modules || modules.length === 0) return null

  // Find the first incomplete module
  const sortedModules = modules.sort((a, b) => a.module_order - b.module_order)

  for (const module of sortedModules) {
    if (!module.progress || module.progress.progress_percentage < 100) {
      return module
    }
  }

  return null // All modules completed
}

export async function markRecommendationViewed(recommendationId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("ai_recommendations").update({ is_viewed: true }).eq("id", recommendationId)

  if (error) {
    throw new Error("Failed to mark recommendation as viewed")
  }
}
