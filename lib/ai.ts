import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"
import { anthropic } from "@ai-sdk/anthropic"

export type AIProvider = "openai" | "groq" | "anthropic"
export type AIModel = string

/**
 * Get the appropriate AI model instance based on provider and model name
 */
export function modelFor(provider: AIProvider, model: string) {
  switch (provider) {
    case "openai":
      return openai(model)
    case "groq":
      return groq(model)
    case "anthropic":
      return anthropic(model)
    default:
      throw new Error(`Unsupported AI provider: ${provider}`)
  }
}

/**
 * Get the default model for the configured provider
 */
export function getDefaultModel(): { provider: AIProvider; model: string } {
  const provider = (process.env.AI_PROVIDER as AIProvider) || "openai"

  const defaultModels = {
    openai: "gpt-4o-mini",
    groq: "llama-3.1-70b-versatile",
    anthropic: "claude-3-haiku-20240307",
  }

  const model = process.env.AI_MODEL || defaultModels[provider]

  return { provider, model }
}

/**
 * Get the configured AI model instance
 */
export function getAIModel() {
  const { provider, model } = getDefaultModel()
  return modelFor(provider, model)
}
