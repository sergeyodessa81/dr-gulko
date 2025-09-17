"use client";
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch(`/api/mock-tests/${params.id}`)
      .then((res) => res.json())
      .then(setTest);
  }, [params.id]);

  if (!test) {
    return <div>Loading…</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">{test.title || 'Mock Test'}</h1>
      {test.questions?.map((q: any) => (
        <div key={q.id} className="mb-6 border rounded p-4">
          <div className="font-medium mb-2">{q.question}</div>
          {q.type === 'single' &&
            q.choices?.map((choice: string, idx: number) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name={q.id}
                  className="mr-2"
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: choice }))
                  }
                />
                {choice}
              </label>
            ))}
          {q.type === 'writing' && (
            <textarea
              className="w-full border rounded p-2"
              rows={6}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
            />
          )}
        </div>
      ))}
      <button
        className="border rounded px-4 py-2"
        onClick={() => {
          console.log('Answers:', answers);
        }}
      >
        Finish
      </button>
    </div>
  );
}
