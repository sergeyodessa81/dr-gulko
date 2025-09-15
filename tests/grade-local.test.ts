import { describe, it, expect } from 'vitest';
import { gradeSingle } from '@/lib/mock-tests/grade-local';

const q = {
  id: 'q1',
  type: 'single' as const,
  prompt: 'demo',
  choices: ['a', 'b'],
  answer: 1,
};

describe('gradeSingle', () => {
  it('accepts correct index', () => {
    expect(gradeSingle(q, 1)).toEqual({ ok: true, expected: 1, got: 1 });
  });
  it('rejects wrong index', () => {
    expect(gradeSingle(q, 0)).toEqual({ ok: false, expected: 1, got: 0 });
  });
  it('rejects non-number', () => {
    expect(gradeSingle(q, '1')).toEqual({ ok: false, expected: 1, got: null });
  });
});
