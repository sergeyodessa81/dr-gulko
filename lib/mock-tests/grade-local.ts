import type { Question, QuestionSingle } from '@/types/mock-tests';

export function gradeSingle(q: QuestionSingle, got: unknown) {
  const idx = typeof got === 'number' ? got : NaN;
  const ok = Number.isInteger(idx) && idx === q.answer;
  return { ok, expected: q.answer, got: Number.isInteger(idx) ? idx : null };
}

export function isShort(q: Question): q is Extract<Question, { type: 'short' }> {
  return q.type === 'short';
}

export function isSingle(q: Question): q is QuestionSingle {
  return q.type === 'single';
}
