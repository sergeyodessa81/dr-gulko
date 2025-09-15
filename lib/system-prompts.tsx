// ... existing code ...

// <CHANGE> Add missing exports that are being imported by other files
export const baseSystem = `You are a helpful German language learning assistant. Provide clear, accurate responses and corrections.`

export const modePrompts = {
  german: "Focus on conversational German with corrections and explanations.",
  editor: "Help with German writing, grammar, and style improvements.",
  "exam-assessor": "Assess German language skills and provide feedback.",
  "ai-teacher": "Act as a friendly German conversation teacher.",
  "writing-lab": "Provide German writing coaching and corrections.",
  "mock-tests": "Generate German language test questions and assessments.",
  "medical-german": "Focus on medical German terminology and contexts.",
  "error-tracking": "Track and analyze common German language errors.",
  "all-levels": "Adapt content for all German proficiency levels."
} as const

// <CHANGE> Add Level type that's being imported
export type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
</ts>
