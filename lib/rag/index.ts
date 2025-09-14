import snippets from "./data/telc-b1-schreiben-snippets.json"

export async function retrieve(query: string, _opts?: { mode?: string }) {
  if (!query) return ""
  // Простейший поиск по подстроке (можно заменить на эмбеддинги позже)
  const hits = (snippets as string[]).filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
  return hits.join("\n---\n")
}
