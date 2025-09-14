import { groq } from "@ai-sdk/groq"
import { generateText, streamText } from "ai"

export interface AIRecommendationRequest {
  userId: string
  userProgress: any[]
  userProfile: any
  recentActivity: any[]
}

export interface ContentSummaryRequest {
  content: string
  maxLength?: number
  language?: string
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export class GroqAIClient {
  private model = groq("llama-3.1-70b-versatile")

  async generatePersonalizedRecommendations(request: AIRecommendationRequest) {
    const { userId, userProgress, userProfile, recentActivity } = request

    const prompt = `You are Dr. Gulko's AI assistant for medical education, specializing in German medical language learning and trauma/orthopedic surgery education.

User Profile:
- Role: ${userProfile?.role || "student"}
- Language: ${userProfile?.preferred_language || "en"}
- Specialization: ${userProfile?.specialization || "general medicine"}
- Current Level: ${this.inferUserLevel(userProgress)}

Learning Progress Analysis:
${userProgress.map((p) => `- ${p.module?.title}: ${p.progress_percentage}% complete (${p.notes || "no notes"})`).join("\n")}

Recent Activity:
${recentActivity.map((a) => `- ${a.type}: ${a.description}`).join("\n")}

Based on this analysis, generate 2-3 highly personalized learning recommendations that:
1. Address knowledge gaps identified in their progress
2. Build upon their current achievements
3. Align with their specialization and role
4. Consider their language learning needs (German medical terminology)
5. Provide clear learning outcomes

Each recommendation should include:
- title: Clear, actionable title
- description: 2-3 sentences explaining the content and benefits
- difficulty: beginner/intermediate/advanced (based on their current level)
- estimated_duration: Realistic hours needed
- confidence_score: 0.0-1.0 (higher for more relevant recommendations)
- recommendation_type: learning_path/module/content
- learning_outcomes: Array of 2-3 specific skills they'll gain
- prerequisites: Any required prior knowledge
- medical_focus: Specific medical area (trauma, orthopedics, general, etc.)

Format as valid JSON array with these exact field names.`

    try {
      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.7,
        maxTokens: 1500,
      })

      const recommendations = this.parseRecommendations(text)
      return recommendations
    } catch (error) {
      console.error("Error generating AI recommendations:", error)
      return this.getFallbackRecommendations()
    }
  }

  async summarizeContent(request: ContentSummaryRequest) {
    const { content, maxLength = 200, language = "en" } = request

    const prompt = `Summarize the following medical content in ${language}. Keep it concise (max ${maxLength} words) and focus on key medical concepts, procedures, and learning points.

Content:
${content}

Provide a clear, professional summary suitable for medical students and practitioners.`

    try {
      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.3,
        maxTokens: Math.min(maxLength * 2, 500),
      })

      return text.trim()
    } catch (error) {
      console.error("Error summarizing content:", error)
      return "Summary unavailable at this time."
    }
  }

  async *chatStream(messages: ChatMessage[]) {
    const systemPrompt = `You are Dr. Gulko's AI medical education assistant. You help medical students and practitioners learn about trauma and orthopedic surgery. 

Guidelines:
- Provide accurate, evidence-based medical information
- Focus on educational content, not clinical advice
- Explain complex concepts clearly
- Reference current medical practices when appropriate
- Always remind users that this is for educational purposes only
- Be encouraging and supportive of learning

Keep responses concise but informative.`

    const formattedMessages = [{ role: "system" as const, content: systemPrompt }, ...messages]

    try {
      const { textStream } = await streamText({
        model: this.model,
        messages: formattedMessages,
        temperature: 0.7,
        maxTokens: 800,
      })

      for await (const delta of textStream) {
        yield delta
      }
    } catch (error) {
      console.error("Error in chat stream:", error)
      yield "I apologize, but I'm having trouble responding right now. Please try again."
    }
  }

  private parseRecommendations(aiResponse: string) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // Fallback parsing if JSON format isn't perfect
      return this.getFallbackRecommendations()
    } catch (error) {
      console.error("Error parsing AI recommendations:", error)
      return this.getFallbackRecommendations()
    }
  }

  private inferUserLevel(userProgress: any[]): string {
    if (!userProgress || userProgress.length === 0) return "beginner"

    const averageProgress = userProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / userProgress.length

    if (averageProgress >= 80) return "advanced"
    if (averageProgress >= 50) return "intermediate"
    return "beginner"
  }

  private getFallbackRecommendations() {
    return [
      {
        title: "German Medical Terminology Fundamentals",
        description:
          "Master essential German medical vocabulary for healthcare professionals. Learn anatomical terms, common procedures, and patient communication phrases.",
        difficulty: "beginner",
        estimated_duration: 3,
        confidence_score: 0.85,
        recommendation_type: "learning_path",
        learning_outcomes: [
          "Basic medical German vocabulary",
          "Patient communication skills",
          "Medical documentation basics",
        ],
        prerequisites: ["Basic German language skills (A2 level)"],
        medical_focus: "general",
      },
      {
        title: "Trauma Assessment in German Healthcare",
        description:
          "Learn systematic trauma evaluation procedures and German medical terminology specific to emergency and trauma care.",
        difficulty: "intermediate",
        estimated_duration: 4,
        confidence_score: 0.78,
        recommendation_type: "module",
        learning_outcomes: ["Trauma assessment protocols", "Emergency German phrases", "Documentation skills"],
        prerequisites: ["Basic medical knowledge", "German A2-B1 level"],
        medical_focus: "trauma",
      },
      {
        title: "Orthopedic Surgery Communication",
        description:
          "Advanced German communication skills for orthopedic surgery, including pre-operative consultations and post-operative care discussions.",
        difficulty: "advanced",
        estimated_duration: 5,
        confidence_score: 0.82,
        recommendation_type: "content",
        learning_outcomes: [
          "Surgical consultation skills",
          "Technical orthopedic terminology",
          "Patient education techniques",
        ],
        prerequisites: ["Medical German basics", "Orthopedic knowledge"],
        medical_focus: "orthopedics",
      },
    ]
  }
}

export const groqClient = new GroqAIClient()
export { groq }
