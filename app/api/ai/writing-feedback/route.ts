import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { text, language = "de" } = await req.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // For now, return mock feedback since we'd need a more sophisticated AI model for detailed writing analysis
    const mockFeedback = {
      score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
      corrections: [
        {
          type: "grammar" as const,
          original: "Der Patient hat Schmerzen",
          suggestion: "Der Patient klagt über Schmerzen",
          explanation: "Verwenden Sie 'klagt über' für medizinische Beschwerden",
          position: { start: 0, end: 25 },
        },
        {
          type: "medical" as const,
          original: "Rückenproblem",
          suggestion: "Lumbalgie",
          explanation: "Verwenden Sie den medizinischen Fachbegriff",
          position: { start: 30, end: 43 },
        },
      ],
      suggestions: [
        "Verwenden Sie mehr spezifische medizinische Terminologie",
        "Strukturieren Sie Ihre Diagnose systematischer",
        "Fügen Sie mehr Details zur Anamnese hinzu",
        "Verwenden Sie Passivkonstruktionen für objektive Beschreibungen",
      ],
      medicalTerms: [
        {
          term: "Anamnese",
          definition: "Systematische Befragung zur Krankengeschichte",
          context: "Die Anamnese ergab eine zweijährige Schmerzhistorie",
        },
        {
          term: "Palpation",
          definition: "Tastuntersuchung zur körperlichen Diagnostik",
          context: "Bei der Palpation zeigten sich Druckschmerzen",
        },
        {
          term: "Differentialdiagnose",
          definition: "Abgrenzung verschiedener möglicher Diagnosen",
          context: "Die Differentialdiagnose umfasst Bandscheibenvorfall und Muskelzerrung",
        },
      ],
    }

    return NextResponse.json(mockFeedback)
  } catch (error) {
    console.error("Error in writing feedback:", error)
    return NextResponse.json({ error: "Failed to analyze writing" }, { status: 500 })
  }
}
