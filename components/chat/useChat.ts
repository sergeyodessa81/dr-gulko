"use client";
import { useState } from 'react';

export function useChat(lab: string) {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function send(content: string) {
    setLoading(true);
    const userMsg = { role: 'user' as const, content };
    try {
      const res = await fetch(`/api/ai/${lab}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [...msgs, userMsg] }),
      });
      const data = await res.json();
      const reply = data?.text ?? '';
      setMsgs([...msgs, userMsg, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMsgs([...msgs, userMsg, { role: 'assistant', content: 'Error' }]);
    } finally {
      setLoading(false);
    }
  }

  return { msgs, send, loading };
}
