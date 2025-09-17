export type Provider = "openai" | "groq" | "anthropic";

export function pickModel(lab: string, tier: "free" | "pro") {
  const provider = (process.env.AI_PROVIDER as Provider) || "openai";
  if (provider === "openai") {
    return { provider, model: process.env.AI_MODEL || "gpt-4o-mini" };
  }
  if (provider === "groq") {
    return { provider, model: process.env.AI_MODEL || "llama-3.1-70b-versatile" };
  }
  if (provider === "anthropic") {
    return { provider, model: process.env.AI_MODEL || "claude-3-haiku-20240307" };
  }
  return { provider: "openai", model: "gpt-4o-mini" };
}
