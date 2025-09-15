export function parseActionJson(text: string) {
  const m = text.match(/```action-json\n([\s\S]*?)\n```/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}
