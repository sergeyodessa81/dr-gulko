'use client';
import { useEffect, useState } from 'react';
import type { MockTest, Question } from '@/types/mock-tests';

export default function Page() {
  const [test, setTest] = useState<MockTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mock-tests/001')
      .then((r) => r.json())
      .then(setTest)
      .catch(() => setError('Fehler beim Laden des Tests'));
  }, []);

  function setAnswer(id: string, v: any) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  const allSinglesAnswered = test?.questions
    .filter((q) => q.type === 'single')
    .every((q) => Number.isInteger(answers[q.id]));

  async function onGrade() {
    try {
      setBusy(true);
      setResult(null);
      setError(null);
      const res = await fetch('/api/mock-tests/grade', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ testId: 'mt-001', answers }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Fehler bei der Bewertung');
      }
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message || 'Unbekannter Fehler');
    } finally {
      setBusy(false);
    }
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!test) return <div className="p-6">Lade…</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{test.title}</h1>
      <ol className="space-y-4 list-decimal list-inside">
        {test.questions.map((q: Question) => (
          <li key={q.id} className="p-4 rounded-2xl shadow border">
            <p className="mb-3 font-medium">{q.prompt}</p>
            {q.type === 'single' && (
              <div className="space-y-2">
                {'choices' in q && q.choices.map((c: string, i: number) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={i}
                      checked={answers[q.id] === i}
                      onChange={() => setAnswer(q.id, i)}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type === 'short' && (
              <div>
                <textarea
                  className="w-full border rounded p-2"
                  maxLength={600}
                  rows={3}
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {(answers[q.id]?.length || 0)}/600
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      <button
        onClick={onGrade}
        disabled={busy || !allSinglesAnswered}
        className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
      >
        {busy ? 'Bewerte…' : 'Bewerten'}
      </button>

      {result && (
        <section className="p-4 rounded-2xl border shadow">
          <h2 className="font-semibold mb-2">Ergebnis</h2>
          <p className="mb-3">Gesamtpunktzahl: {result.scoreTotal}</p>
          <ul className="space-y-2">
            {result.details.map((d: any) => (
              <li key={d.id} className="text-sm">
                <span className="font-medium">{d.id}</span>: {d.kind === 'single' ? (
                  <span>{d.ok ? '✅ richtig' : '❌ falsch'} (erwartet {String(d.expected)}, bekommen {String(d.got)})</span>
                ) : (
                  <span>{String(d.score)} — {d.feedback}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
