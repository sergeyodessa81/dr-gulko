// Environment variable validation and defaults
export const env = {
  AI_PROVIDER: (process.env.AI_PROVIDER as "openai" | "groq" | "anthropic") || "openai",
  AI_MODEL: process.env.AI_MODEL || getDefaultModelForProvider(process.env.AI_PROVIDER as any),
  AI_API_KEY: process.env.AI_API_KEY || getAPIKeyForProvider(process.env.AI_PROVIDER as any),
  AI_SYSTEM_PROMPT_VERSION: process.env.AI_SYSTEM_PROMPT_VERSION || "v1",
} as const

function getDefaultModelForProvider(provider: string) {
  switch (provider) {
    case "groq":
      return "llama-3.1-70b-versatile"
    case "anthropic":
      return "claude-3-haiku-20240307"
    case "openai":
    default:
      return "gpt-5-mini"
  }
}

function getAPIKeyForProvider(provider: string) {
  switch (provider) {
    case "groq":
      return process.env.GROQ_API_KEY
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY
    case "openai":
    default:
      return process.env.OPENAI_API_KEY
  }
}
