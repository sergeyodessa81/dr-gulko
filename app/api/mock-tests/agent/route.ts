import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

export const runtime = "edge"

// Mock test data (for now, hardcoded - could be moved to a data service)
const mockTestData = {
  id: "mt-001",
  title: "Mock Test 1",
  lang: "de",
  questions: [
    {
      type: "single" as const,
      id: "q1",
      question: "Wie heißt die Hauptstadt von Deutschland?",
      choices: ["München", "Berlin", "Hamburg", "Köln"],
      answer: 1,
      points: 2,
    },
    {
      type: "single" as const,
      id: "q2",
      question: "Welcher Artikel gehört zu dem Wort 'Haus'?",
      choices: ["der", "die", "das"],
      answer: 2,
      points: 1,
    },
    {
      type: "short" as const,
      id: "q3",
      question: "Beschreiben Sie Ihren typischen Tagesablauf. (50-80 Wörter)",
      rubric:
        "Bewertung: Grammatik (0-3), Wortschatz (0-3), Struktur (0-2), Aufgabenbezug (0-2). Mindestens 50 Wörter erforderlich.",
      maxPoints: 10,
    },
    {
      type: "short" as const,
      id: "q4",
      question: "Was machen Sie gerne in Ihrer Freizeit? Begründen Sie Ihre Antwort.",
      rubric:
        "Bewertung: Inhalt und Begründung (0-4), Sprachrichtigkeit (0-3), Ausdruck (0-3). Vollständige Sätze verwenden.",
      maxPoints: 10,
    },
  ],
}

// Tool definitions
const tools = {
  getQuestion: {
    description: "Get a question by ID",
    parameters: z.object({
      id: z.string().describe("Question ID"),
    }),
    execute: async ({ id }: { id: string }) => {
      const question = mockTestData.questions.find((q) => q.id === id)
      return question || null
    },
  },
  hintSingle: {
    description: "Give a hint for a single choice question without revealing the answer",
    parameters: z.object({
      id: z.string().describe("Question ID"),
      chosen: z.number().optional().describe("Index of chosen answer (optional)"),
    }),
    execute: async ({ id, chosen }: { id: string; chosen?: number }) => {
      const question = mockTestData.questions.find((q) => q.id === id)
      if (!question || question.type !== "single") {
        return "Question not found or not a single choice question."
      }

      // Provide contextual hints based on the question
      if (id === "q1") {
        if (chosen !== undefined && chosen !== question.answer) {
          return "Think about which city is the political center of Germany, not just a large city."
        }
        return "Consider which German city houses the government and parliament."
      }

      if (id === "q2") {
        if (chosen !== undefined && chosen !== question.answer) {
          return "Remember that 'Haus' is a neuter noun in German."
        }
        return "Think about the gender of the word 'Haus' - is it masculine, feminine, or neuter?"
      }

      return "Review the question carefully and consider each option."
    },
  },
  saveProgress: {
    description: "Save user progress (stub implementation)",
    parameters: z.object({
      userKey: z.string().describe("User identifier"),
      id: z.string().describe("Question or test ID"),
      payload: z.any().describe("Progress data to save"),
    }),
    execute: async ({ userKey, id, payload }: { userKey: string; id: string; payload: any }) => {
      // Stub implementation - in real app would save to database
      return { saved: true }
    },
  },
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const result = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      temperature: 0,
      system: "Use ONLY tools; be concise; never reveal solutions for single; return a friendly 1–2 sentence hint.",
      prompt: message,
      tools,
    })

    return Response.json({
      text: result.text,
      toolResults: result.toolResults,
    })
  } catch (error) {
    console.error("Agent API error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
