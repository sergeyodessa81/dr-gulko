import { z } from "zod"

// Single choice question schema
export const QuestionSingleSchema = z.object({
  type: z.literal("single"),
  id: z.string(),
  question: z.string(),
  choices: z.array(z.string()).min(2),
  answer: z.number().min(0), // Index of correct choice
  points: z.number().positive(),
})

// Short answer question schema
export const QuestionShortSchema = z.object({
  type: z.literal("short"),
  id: z.string(),
  question: z.string(),
  rubric: z.string(), // Scoring criteria
  maxPoints: z.number().positive(),
})

// Union of question types
export const QuestionSchema = z.union([QuestionSingleSchema, QuestionShortSchema])

// Mock test schema
export const MockTestSchema = z.object({
  id: z.string(),
  title: z.string(),
  lang: z.string(),
  questions: z.array(QuestionSchema).min(1),
})

// Inferred TypeScript types
export type QuestionSingle = z.infer<typeof QuestionSingleSchema>
export type QuestionShort = z.infer<typeof QuestionShortSchema>
export type Question = z.infer<typeof QuestionSchema>
export type MockTest = z.infer<typeof MockTestSchema>
