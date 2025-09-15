import { z } from 'zod';

export const GraderJsonSchema = z.object({
  score: z.union([z.literal(0), z.literal(0.5), z.literal(1)]),
  feedback: z.string().max(220),
});

export type GraderJson = z.infer<typeof GraderJsonSchema>;

export function parseStrictJson(text: string): GraderJson | null {
  // Reject markdown code fences; expect raw JSON object only
  const trimmed = text.trim();
  if (trimmed.startsWith('```') || trimmed.endsWith('```')) return null;
  try {
    const obj = JSON.parse(trimmed);
    const res = GraderJsonSchema.safeParse(obj);
    return res.success ? res.data : null;
  } catch {
    return null;
  }
}
