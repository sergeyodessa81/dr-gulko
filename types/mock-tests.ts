import { z } from 'zod';

export const QuestionSingleSchema = z.object({
  id: z.string(),
  type: z.literal('single'),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  answer: z.number().int().nonnegative(), // index
  rubric: z.string().optional(),
});

export const QuestionShortSchema = z.object({
  id: z.string(),
  type: z.literal('short'),
  prompt: z.string().min(1),
  rubric: z.string().min(1),
});

export const QuestionSchema = z.discriminatedUnion('type', [
  QuestionSingleSchema,
  QuestionShortSchema,
]);

export const MockTestSchema = z.object({
  id: z.string(),
  title: z.string(),
  lang: z.enum(['de', 'en']).default('de'),
  questions: z.array(QuestionSchema).min(1),
});

export type Question = z.infer<typeof QuestionSchema>;
export type QuestionSingle = z.infer<typeof QuestionSingleSchema>;
export type QuestionShort = z.infer<typeof QuestionShortSchema>;
export type MockTest = z.infer<typeof MockTestSchema>;
