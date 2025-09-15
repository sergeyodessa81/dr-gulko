import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import test001 from '@/data/mock-tests/001.json';
import { MockTestSchema, type Question } from '@/types/mock-tests';
import { gradeSingle, isSingle, isShort } from '@/lib/mock-tests/grade-local';
import { SHORT_ANSWER_GRADER_SYSTEM, buildShortAnswerPrompt } from '@/lib/system-prompts';
import { abortAfter, askText, pickModel } from '@/lib/ai';
import { parseStrictJson } from '@/lib/llm-json';

export const runtime = 'edge';

const BodySchema = z.object({
testId: z.literal('mt-001'),
answers: z.record(z.string(), z.any()),
});

export async function POST(req: NextRequest) {
const parsed = BodySchema.safeParse(await req.json());
if (!parsed.success) {
return NextResponse.json({ error: 'Bad request' }, { status: 400 });
}

const test = MockTestSchema.parse(test001);
let scoreTotal = 0;
const details: Array<Record<string, any>> = [];

for (const q of test.questions) {
const got = parsed.data.answers[q.id];

if (isSingle(q)) {
const r = gradeSingle(q, got);
if (r.ok) scoreTotal += 1;
details.push({ id: q.id, kind: 'single', ...r });
continue;
}

if (isShort(q)) {
const answerText = typeof got === 'string' ? got.slice(0, 600) : '';
const { signal, cancel } = abortAfter(10_000);
try {
const { text } = await askText({
model: pickModel('mock-tests', 'free'),
system: SHORT_ANSWER_GRADER_SYSTEM,
prompt: buildShortAnswerPrompt({
question: q.prompt,
rubric: q.rubric,
studentAnswer: answerText,
}),
temperature: 0,
abortSignal: signal,
});
cancel();
const json = parseStrictJson(text);
if (json) {
scoreTotal += json.score;
details.push({ id: q.id, kind: 'short', score: json.score, feedback: json.feedback });
} else {
details.push({ id: q.id, kind: 'short', score: 0, feedback: 'Ungültiges Format.' });
}
} catch (e) {
details.push({ id: q.id, kind: 'short', score: 0, feedback: 'Timeout oder Modellfehler.' });
}
continue;
}
}

return NextResponse.json({ testId: test.id, scoreTotal, details });
}
