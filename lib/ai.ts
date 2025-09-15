import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { createGroq } from "@ai-sdk/groq"
import { AbortSignal } from "abort-controller"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export function modelFor(provider?: string, model?: string) {
  const aiProvider = provider || process.env.AI_PROVIDER || "openai"
  const aiModel = model || process.env.AI_MODEL || getDefaultModel(aiProvider)

  switch (aiProvider) {
    case "openai":
      return openai(aiModel)
    case "anthropic":
      return anthropic(aiModel)
    case "groq":
      return groq(aiModel)
    default:
      return openai(aiModel)
  }
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case "openai":
      return "gpt-4o-mini"
    case "anthropic":
      return "claude-3-haiku-20240307"
    case "groq":
      return "llama-3.1-70b-versatile"
    default:
      return "gpt-4o-mini"
  }
}

export function pickModel(mode?: string, tier?: string) {
  const provider = process.env.AI_PROVIDER || "openai"
  const model = process.env.AI_MODEL || getDefaultModel(provider)
  return { provider, model }
}

export function getModel(config: { provider: string; model: string }) {
  return modelFor(config.provider, config.model)
}

export async function askText(prompt: string, options?: { temperature?: number; maxTokens?: number }) {
  const { generateText } = await import("ai")
  const model = modelFor()

  const result = await generateText({
    model,
    prompt,
    temperature: options?.temperature ?? 0.7,
    maxTokens: options?.maxTokens ?? 500,
  })

  return result.text
}

export function abortAfter(ms: number) {
  return AbortSignal.timeout(ms)
}
