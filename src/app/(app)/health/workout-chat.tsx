"use client";

import { useRef, useState, useTransition } from "react";
import { askWorkoutCoachAction } from "./actions";
import type { ChatTurn } from "@/lib/ai/workout-coach";

export function WorkoutChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isPending) return;

    const nextMessages: ChatTurn[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      const reply = await askWorkoutCoachAction(messages, text);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      {messages.length === 0 ? (
        <p className="text-sm text-slate-400">
          Ask things like &ldquo;what weight for bench today?&rdquo; — the
          coach looks at your recent logged sets.
        </p>
      ) : (
        <ul className="mb-3 space-y-2">
          {messages.map((m, i) => (
            <li
              key={i}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-6 bg-brand-50 text-slate-900"
                  : "mr-6 bg-slate-50 text-slate-700"
              }`}
            >
              {m.content}
            </li>
          ))}
          {isPending && (
            <li className="mr-6 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-400">
              Thinking…
            </li>
          )}
        </ul>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
