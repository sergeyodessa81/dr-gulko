import { type NextRequest, NextResponse } from "next/server"
import type { MockTest } from "@/types/mock-tests"

export const runtime = "edge"

// Mock test data - in production this would come from a database
const mockTestData: Record<string, MockTest> = {
  "001": {
    id: "mt-001",
    title: "Mock Test 1",
    lang: "de",
    questions: [
      {
        type: "single",
        id: "q1",
        question: "Wie heißt die Hauptstadt von Deutschland?",
        choices: ["München", "Berlin", "Hamburg", "Köln"],
        answer: 1,
        points: 2,
      },
      {
        type: "single",
        id: "q2",
        question: "Welcher Artikel gehört zu dem Wort 'Haus'?",
        choices: ["der", "die", "das"],
        answer: 2,
        points: 1,
      },
      {
        type: "short",
        id: "q3",
        question: "Beschreiben Sie Ihren typischen Tagesablauf. (50-80 Wörter)",
        rubric:
          "Bewertung: Grammatik (0-3), Wortschatz (0-3), Struktur (0-2), Aufgabenbezug (0-2). Mindestens 50 Wörter erforderlich.",
        maxPoints: 10,
      },
      {
        type: "short",
        id: "q4",
        question: "Was machen Sie gerne in Ihrer Freizeit? Begründen Sie Ihre Antwort.",
        rubric:
          "Bewertung: Inhalt und Begründung (0-4), Sprachrichtigkeit (0-3), Ausdruck (0-3). Vollständige Sätze verwenden.",
        maxPoints: 10,
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  // Check if mock test exists
  const mockTest = mockTestData[id]

  if (!mockTest) {
    return NextResponse.json({ error: "Mock test not found" }, { status: 404 })
  }

  // Return mock test with caching headers
  return NextResponse.json(mockTest, {
    headers: {
      "Cache-Control": "public, max-age=60",
    },
  })
}
