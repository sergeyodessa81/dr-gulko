import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import test001 from '@/data/mock-tests/001.json';
import { MockTestSchema } from '@/types/mock-tests';
import { pickModel, askText } from '@/lib/ai';

export const runtime = 'edge';

const questions = MockTestSchema.parse(test001).questions;

export async function POST(req: NextRequest) {
const body = await req.json().catch(() => ({}));
const message = typeof body?.message === 'string' ? body.message.slice(0, 500) : '';
if (!message) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

const toolDefs = {
getQuestion: {
description: 'Return question object by id',
parameters: z.object({ id: z.string() }),
execute: async ({ id }: { id: string }) => questions.find((q) => q.id === id) ?? null,
},
hintSingle: {
description: 'Give a short hint for a single-choice question without revealing the answer',
parameters: z.object({ id: z.string(), chosen: z.number().int().nonnegative().optional() }),
execute: async ({ id }: { id: string }) => {
// Very simple heuristic hints
if (id === 'q1') return 'Achte auf das grammatische Geschlecht des Berufsnamens.';
if (id === 'q2') return 'Welche Präposition verwendet man typischerweise mit "warten"?';
return 'Lies die Frage sorgfältig und prüfe die Optionen.';
},
},
saveProgress: {
description: 'Stub: save progress (no-op)',
parameters: z.object({ userKey: z.string(), id: z.string(), payload: z.any() }),
execute: async (args: any) => ({ saved: true, at: new Date().toISOString(), ...args }),
},
} as const;

// Minimal tool-calling via function-calling messages
const { text, toolCalls } = await askText({
model: pickModel('mock-tests', 'free'),
temperature: 0,
system:
'Du bist ein knapper Tutor. Verwende NUR die bereitgestellten Tools. Gib kurze, freundliche Hinweise (1–2 Sätze). Offenbare niemals die richtige Lösung.',
messages: [
{ role: 'user', content: message },
],
// @ts-expect-error - the ai sdk infers tool types at runtime
tools: toolDefs,
} as any);

return NextResponse.json({ text, toolCalls });
}
