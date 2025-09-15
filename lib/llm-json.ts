// lib/llm-json.ts
import { z } from 'zod';

export const GraderJsonSchema = z.object({
score: z.union([z.literal(0), z.literal(0.5), z.literal(1)]),
feedback: z.string().max(220),
});

export type GraderJson = z.infer<typeof GraderJsonSchema>;

export function parseStrictJson(text: string): GraderJson | null {
// Reject if it contains code fences or looks like markdown
if (/```|\{\s*\n|\n\s*\}/.test(text) && !/^\{[\s\S]*\}$/.test(text.trim())) {
return null;
}
try {
const obj = JSON.parse(text.trim());
const res = GraderJsonSchema.safeParse(obj);
return res.success ? res.data : null;
} catch {
return null;
}
}
