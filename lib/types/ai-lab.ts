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
