import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"

export function getModel(model: string): LanguageModel {
  const baseURL = process.env.VERCEL_AI_GATEWAY_URL ? `${process.env.VERCEL_AI_GATEWAY_URL}/openai` : undefined // напрямую в OpenAI через Vercel AI SDK
  return createOpenAI({
    apiKey: process.env.VERCEL_AI_GATEWAY_API_KEY, // если без Gateway — можно пропустить
    baseURL,
  }).languageModel(model || process.env.AI_DEFAULT_MODEL || "gpt-5-mini")
}

export function pickModel(mode?: string, tier: "demo" | "pro" | "heavy" = "pro") {
  if (tier === "demo") return "gpt-4o-mini"
  if (tier === "heavy") return "gpt-5"
  return process.env.AI_DEFAULT_MODEL || "gpt-5-mini"
}
