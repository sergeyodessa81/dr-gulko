You
are
updating
an
existing
Next.js (App Router, TypeScript, Tailwind)
project
for drgulko.org.\
Goal
: ship a German-learning MVP
with 6 chat
modes + deep
exam
analysis, Anki
export
, and clean UI.\
Use Edge runtime
for AI routes and Vercel
AI
SDK (ai, @ai-sdk/openai, ai/react).
\
Keep code minimal, production-ready,
with rounded-2xl cards
and
spacing.Do
not
add
extra
dependencies.
\
Create/Update these files exactly:
FILE: src/lib/system-prompts.ts
--------------------------------
export const baseSystem = `
You are a German A1–C1 tutor and exam assessor.
Goals: explain grammar, generate exercises, correct texts, create Anki cards, score essays by telc/Goethe rubrics.
Be concise, structured, clear.
Default language: German for examples, Russian for translations.
Always: 1–3 examples + 2–3 tasks; show answers after a divider.
Propose 3–5 Anki cards in action-json format if useful.
Never talk about medicine.
If unsure, ask 1 clarifying question.
`

export const modePrompts = {
  german: `Explain a German topic simply using high-frequency vocab. Format: bullets → 2–3 tasks.`,
  editor: `Correct text. Output only: (1) corrected version, (2) ≤5 bullets “Why” with grammar/lexis notes. Keep original tone.`,
  caption: `Produce 2 variants: A (short/plain), B (engaging). Add ≤5 hashtags.`,
  script: `Structure: Hook → 3–5 beats → CTA. Mark OST/VO lines if useful.`,
  anki: `Batch CSV with columns: term|grammar|meaning|example_de|example_ru|tags. Default deck “Deutsch — DrGulko”.`,
  "exam-assessor": `Evaluate exam answers by rubric (telc/Goethe). Return JSON: {"gesamt":<int>,"kriterien":{...}} + 1–2 line feedback.`,
  "deep-exam": `Advanced essay analysis. Steps:
1) JSON line with scores: {"gesamt":<int>,"kriterien":{"Grammatik":0-3,"Lexik":0-3,"Struktur":0-3,"Aufgabenbezug":0-3},"cefr":"B1|B2|C1"}
2) Feedback sections: Grammatik, Lexik/Collocations, Struktur/Kohärenz, Aufgabenbezug/Pragmatik, Stil/Register.
3) Minimal corrected version (only meaningful changes).
4) Improvement plan (3–5 bullets).
5) CEFR reasoning (≤3 sentences).
6) Finish with action-json block: {"action":"anki.queue","deck":"Deutsch — DrGulko","confirm":"preview","cards":[...]} with 3–7 cards.
Strictly follow this structure.
`,
} as const
FILE: src / lib / ai / providers.ts
-----------------------------
import { createOpenAI } from "@ai-sdk/openai"
import type { LanguageModel } from "ai"

export function getModel(model?: string): LanguageModel {
  const useGateway = !!process.env.VERCEL_AI_GATEWAY_URL && !!process.env.VERCEL_AI_GATEWAY_API_KEY

  const baseURL = useGateway ? `${process.env.VERCEL_AI_GATEWAY_URL}/openai` : undefined
  const apiKey = useGateway ? process.env.VERCEL_AI_GATEWAY_API_KEY : process.env.OPENAI_API_KEY

  return createOpenAI({ apiKey, baseURL }).languageModel(model || process.env.AI_DEFAULT_MODEL || "gpt-5-mini")
}

export function pickModel(mode?: string, tier: "demo" | "pro" | "heavy" = "pro") {
  if (tier === "demo") return "gpt-4o-mini"
  if (tier === "heavy") return "gpt-5"
  return process.env.AI_DEFAULT_MODEL || "gpt-5-mini"
}
FILE: src / lib / fewshots / german.json
----------------------------------
{
  "examples": [
    {
      "user": "Er geht in die Stadt vs Er ist in der Stadt — warum?",
      "assistant": "- Bewegung/Ziel → Akkusativ: in + Akk. → „in die Stadt\" (куда?)\n- Lage/Ruhe → Dativ: in + Dat. → „in der Stadt\" (где?)\n- Merksatz: Wohin? Akk. | Wo? Dat.\n- Übungen (2): 1) Ich gehe __ die Bibliothek. 2) Ich bin __ der Bibliothek.\n—\nAntworten: 1) in die  2) in der"
    }
  ]
}
FILE: src / lib / fewshots / editor.json
----------------------------------
{
  "examples": [
    {
      "user": "Я начал смотреть Krank Berlin, это мой первый сериал на немецком.",
      "assistant": "Я начал смотреть *Krank Berlin* — это мой первый сериал на немецком.\n—\nWhy:\n• тире вместо запятой\n• единый стиль\n• без лишних кавычек"
    }
  ]
}
FILE: src / lib / fewshots / exam - assessor.json
-----------------------------------------
{
  "examples": [
    {
      "user": "B1 Schreiben: Beschwerdebrief (120 Wörter)...",
      "assistant": "{\"gesamt\": 9, \"кriterien\": {\"Grammatik\":2, \"Lexik\":2, \"Struktur\":3, \"Aufgabenbezug\":2}}\nKurzer Kommentar: Gute Struktur, aber Fehler bei Verbendungen."
    }
  ]
}
FILE: src / lib / rubrics / telc - b1 - schreiben.json
--------------------------------------------
{
  "criteria": [
    { "name": "Grammatik", "max": 3 },
    { "name": "Lexik", "max": 3 },
    { "name": "Struktur", "max": 3 },
    { "name": "Aufgabenbezug", "max": 3 }
  ]
}
FILE: src / lib / rag / data / telc - b1 - schreiben - snippets.json
------------------------------------------------------
[
  "B1 Schreiben Kriterien: Grammatik (0–3), Lexik (0–3), Struktur (0–3), Aufgabenbezug (0–3).",
  "Beschwerdebrief: klare Einleitung, Anlass, Forderung, höfliche Schlussformel.",
  "Aufgabenbezug: alle Punkte der Aufgabe müssen erwähnt werden."
]
FILE: src / lib / rag / index.ts
--------------------------
import snippets from "./data/telc-b1-schreiben-snippets.json"
export async function retrieve(query: string, _opts?: { mode?: string }) {
  if (!query) return ""
  const q = query.toLowerCase()
  \
  const hits = (snippets as string[]).filter((s) => s.toLowerCase().includes(q)).slice(0, 3)
  return hits.join("\n---\n")
}
FILE: src / utils / parseActionJson.ts
----------------------------------
export function parseActionJson(text: string) {
  const m = text.match(/```action-json\\n([\\s\\S]*?)\\n```/)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}
\
FILE: src/app/api/ai/chat/route.ts
----------------------------------
import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { baseSystem, modePrompts } from "@/lib/system-prompts"
import { getModel, pickModel } from "@/lib/ai/providers"
import germanFew from "@/lib/fewshots/german.json"
import editorFew from "@/lib/fewshots/editor.json"
import examFew from "@/lib/fewshots/exam-assessor.json"
import { retrieve } from "@/lib/rag"

export const runtime = "edge"
const fewMap: Record<string, any> = { german: germanFew, editor: editorFew, "exam-assessor": examFew }

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const mode = (url.searchParams.get("mode") || "german").toLowerCase()
  const tier = (url.searchParams.get("tier") || "pro") as "demo" | "pro" | "heavy"
  const body = await req.json()

  const system = `${baseSystem}\n\n[Mode:${mode}] ${modePrompts[mode as keyof typeof modePrompts] ?? ""}`
  const few = fewMap[mode] ? [{ role: "system" as const, content: JSON.stringify(fewMap[mode]) }] : []
  const lastUser = String(body?.messages?.at(-1)?.content || "")
  const ctx = await retrieve(lastUser, { mode })
  const contextMsg = ctx ? [{ role: "system" as const, content: `Context:\n${ctx}` }] : []

  const model = getModel(pickModel(mode, tier))

  const result = await streamText({
    model,
    system,
    messages: [...few, ...contextMsg, ...(body?.messages || [])],
    temperature: 0.2,
    maxTokens: tier === "demo" ? 300 : 600,
  })

  return result.toAIStreamResponse()
}
FILE: src / app / api / exam / assess / route.ts
--------------------------------------
import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { getModel } from "@/lib/ai/providers"
import rubric from "@/lib/rubrics/telc-b1-schreiben.json"

export const runtime = "edge"
\
export async function POST(req: NextRequest) {
  const { text } = await req.json()
  const system = `Evaluate a B1 Schreiben answer using the provided rubric. Return JSON with per-criterion scores and 1–2 line feedback.`
  const user = `RUBRIC:\n${JSON.stringify(rubric)}\n\nANSWER:\n${text}`
  const result = await streamText({
    model: getModel("gpt-5-mini"),
    system,
    messages: [{ role: "user", content: user }],
    temperature: 0.2,
    maxTokens: 400,
  })
  return result.toAIStreamResponse()
}
FILE: src / app / api / exam / deep / route.ts
------------------------------------
import type { NextRequest } from "next/server"
import { streamText } from "ai"
import { getModel } from "@/lib/ai/providers"

export const runtime = "edge"

const system = `\
You are an advanced German exam assessor (telc/Goethe). Be rigorous and concise.
Return: (1) JSON scoring, (2) deep feedback sections, (3) minimal corrected version,
(4) improvement plan, (5) CEFR guess, (6) action-json with 3–7 Anki cards.
Use German for scoring labels, short RU glosses when helpful. No medical topics.
`

export async function POST(req: NextRequest) {
  const { text, rubric, level = "B2", exam = "Goethe", maxCards = 5 } = await req.json()

  const prompt = `
EXAM: ${exam} | LEVEL: ${level}
RUBRIC:
${JSON.stringify(rubric)}

ESSAY (user text):
${text}

RESPONSE FORMAT (strict):
1) JSON (line) with scoring:
{"gesamt":<int>,"kriterien":{"Grammatik":0-3,"Lexik":0-3,"Struktur":0-3,"Aufgabenbezug":0-3},"cefr":"B1|B2|C1"}

2) Feedback — sections:
- Grammatik: …
- Lexik/Collocations: …
- Struktur/Kohärenz: …
- Aufgabenbezug/Pragmatik: …
- Stil/Register: …

3) Minimal corrected version (nur sinnvolle, kleine Änderungen)

4) Improvement plan (3–5 bullets, konkret)

5) CEFR reasoning (≤3 Sätze)

6) Anki cards (finish with fenced block):
\`\`\`action-json
{"action":"anki.queue","deck":"Deutsch — DrGulko","confirm":"preview","cards":[
  {"term":"","grammar":"","meaning":"","example_de":"","example_ru":"","tags":["Exam_"+level]}
]}
\`\`\`
Only include the action-json block if there are cards.
`

  const result = await streamText({
    model: getModel("gpt-5"),
    system,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    maxTokens: 1200,
  })

  return result.toAIStreamResponse()
}
FILE: src / components / AIChatClient.tsx
-------------------------------------
"use client"
import { useChat } from "ai/react"
import { useMemo } from "react"
import { parseActionJson } from "@/utils/parseActionJson"

export default function AIChatClient({
  mode = "german",
  tier = "pro",
}: { mode?: string; tier?: "demo" | "pro" | "heavy" }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/ai/chat?mode=${mode}&tier=${tier}`,
  })

  const action = useMemo(() => {
    const last = messages[messages.length - 1]
    if (!last) return null
    return parseActionJson(String(last.content || ""))
  }, [messages])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="border rounded-2xl p-4 h-[60vh] overflow-auto mb-3 bg-white/50">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <div className="text-xs opacity-60">{m.role}</div>
            <div className="whitespace-pre-wrap leading-relaxed">{String(m.content)}</div>
          </div>
        ))}
        {isLoading && <div className="text-sm opacity-60">…thinking</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Frag mich auf Deutsch…"
        />
        <button className="rounded-xl px-4 py-2 border" type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      {action?.action === "anki.queue" && (
        <div className="mt-4 border rounded-xl p-3">
          <div className="font-medium mb-2">Anki preview ({action.cards?.length})</div>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(action.cards, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
FILE: src / components / AnkiExport.tsx
-----------------------------------
"use client"
type Card = { term: string; grammar: string; meaning: string; example_de: string; example_ru: string; tags: string[] }

export default function AnkiExport({ cards }: { cards: Card[] }) {
  const download = () => {
    const header = "term|grammar|meaning|example_de|example_ru|tags";
    const rows = cards.map(c =>
      [c.term, c.grammar, c.meaning, c.example_de, c.example_ru, c.tags.join(";")]
        .map(v => (v ?? "").replace(/\n/g," ").replace(/\|/g,"/"))
        .join("|")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "anki.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download} className="mt-2 border rounded-lg px-3 py-1">
      Download CSV
    </button>
  );
}
FILE: src / app / ai / page.tsx
-------------------------
"use client"
import { useState } from "react"
import AIChatClient from "@/components/AIChatClient"

const tabs = [
  { key: "german", label: "German" },
  { key: "editor", label: "Editor" },
  { key: "caption", label: "Caption" },
  { key: "script", label: "Script" },
  { key: "exam-assessor", label: "Examiner" },
  { key: "deep-exam", label: "Deep Analysis" },
]

export default function AIPage() {
  const [tab, setTab] = useState("german");
  const tier = tab === "deep-exam" ? "heavy" : "pro";
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">AI Language Lab</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 rounded-2xl border ${tab===t.key ? "bg-black text-white" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      <AIChatClient mode={tab as any} tier={tier as any} />
    </div>
  );
}
FILE: src / app / demo / page.tsx
---------------------------
import AIChatClient from "@/components/AIChatClient"

export default function DemoPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">A1–C1 Demo</h1>
      <p className="opacity-70 mb-4">You have 5 free messages. For full access, sign up.</p>
      <AIChatClient mode="german" tier="demo" />
    </div>
  );
}
Environment
Variables (set in Vercel → Project Settings → Environment)
:
AI_DEFAULT_PROVIDER=openai
AI_DEFAULT_MODEL=gpt-5-mini
AI_SYSTEM_PROMPT_VERSION=v1
# EITHER via Vercel AI Gateway:
VERCEL_AI_GATEWAY_URL=<<Base URL from Gateway>>\
VERCEL_AI_GATEWAY_API_KEY=<<Gateway API Key>>\
# OR direct OpenAI:\
# OPENAI_API_KEY=sk-...
After generation:
Deploy and test /demo (cheap model, 5 free messages policy enforced in UI copy).
Test /ai tabs.
Test /api/exam/assess and /api/exam/deep via UI (Examiner / Deep Analysis).
Keep responses concise
respect
maxTokens((demo = 300), (pro = 600), (deep = 1200)).Do
not
add
libraries
beyond
those
required
by
Next.js + Vercel
AI
SDK.
\
