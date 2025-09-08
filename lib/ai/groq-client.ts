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

    const prompt = `You are Dr. Gulko's AI assistant for medical education. Generate personalized learning recommendations for a user based on their profile and progress.

User Profile:
- Role: ${userProfile?.role || "student"}
- Language: ${userProfile?.preferred_language || "en"}
- Specialization: ${userProfile?.specialization || "general medicine"}

Recent Progress:
${userProgress.map((p) => `- ${p.module?.title}: ${p.progress_percentage}% complete`).join("\n")}

Recent Activity:
${recentActivity.map((a) => `- ${a.type}: ${a.description}`).join("\n")}

Generate 2-3 specific, actionable learning recommendations that would help this user advance their medical education. Focus on trauma and orthopedic surgery topics. Each recommendation should include:
1. Title
2. Description (2-3 sentences)
3. Difficulty level (beginner/intermediate/advanced)
4. Estimated duration in hours
5. Confidence score (0.0-1.0)

Format as JSON array with these fields: title, description, difficulty, estimated_duration, confidence_score, recommendation_type`

    try {
      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // Parse the AI response and structure it
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

  private getFallbackRecommendations() {
    return [
      {
        title: "Advanced Trauma Assessment Techniques",
        description: "Learn systematic approaches to trauma patient evaluation and priority-based treatment protocols.",
        difficulty: "intermediate",
        estimated_duration: 4,
        confidence_score: 0.85,
        recommendation_type: "learning_path",
      },
      {
        title: "Orthopedic Imaging Interpretation",
        description: "Master the interpretation of X-rays, CT scans, and MRI for orthopedic conditions.",
        difficulty: "advanced",
        estimated_duration: 6,
        confidence_score: 0.78,
        recommendation_type: "module",
      },
    ]
  }
}

export const groqClient = new GroqAIClient()
