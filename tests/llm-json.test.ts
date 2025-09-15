import { describe, it, expect } from 'vitest';
import { parseStrictJson } from '@/lib/llm-json';

describe('parseStrictJson', () => {
  it('parses valid JSON', () => {
    const j = parseStrictJson('{"score":1,"feedback":"Korrekt."}');
    expect(j).toEqual({ score: 1, feedback: 'Korrekt.' });
  });
  it('rejects markdown-ish output', () => {
    const j = parseStrictJson('```json\n{"score":1,"feedback":"ok"}\n```');
    expect(j).toBeNull();
  });
  it('rejects wrong keys', () => {
    const j = parseStrictJson('{"points":1,"note":"ok"}');
    expect(j).toBeNull();
  });
});
