// app/api/ai/[lab]/route.ts
import { NextRequest } from 'next/server';
import { systemPrompts } from '@/lib/system-prompts';
import { pickModel } from '@/lib/pick-model';

export const runtime = 'edge';

export async function POST(req: NextRequest, { params }: { params: { lab: string } }) {
  const { messages } = await req.json();
  const lab = params.lab;
  const system = systemPrompts[lab as keyof typeof systemPrompts] ?? 'You are a helpful assistant.';
  const { provider, model } = pickModel(lab, 'free');

  const apiKey =
    provider === 'openai'
      ? process.env.AI_API_KEY
      : provider === 'groq'
      ? process.env.GROQ_API_KEY
      : process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
  }

  const url =
    provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.anthropic.com/v1/messages';

  const headers: Record<string, string> =
    provider === 'anthropic'
      ? {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        }
      : {
          'content-type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        };

  const body =
    provider === 'anthropic'
      ? JSON.stringify({
          model,
          system,
          messages,
          max_tokens: 1024,
        })
      : JSON.stringify({
          model,
          messages: [{ role: 'system', content: system }, ...messages],
          temperature: 0.2,
          stream: false,
        });

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!r.ok) {
    return new Response(await r.text(), { status: r.status });
  }
  const data = await r.json();
  const text =
    provider === 'anthropic'
      ? data?.content?.[0]?.text
      : data?.choices?.[0]?.message?.content ?? '';
  return Response.json({ text });
}
