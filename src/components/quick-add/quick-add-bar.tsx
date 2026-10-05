"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  quickAddAction,
  aiQuickAddAction,
  type QuickAddState,
  type AiQuickAddState,
} from "@/lib/quick-add/action";
import type { QuickAddDestination } from "@/lib/quick-add/router";
import { PlusIcon } from "@/components/nav/icons";

const DESTINATION_LABELS: Record<QuickAddDestination, string> = {
  task: "Task",
  meal: "Meal",
  assignment: "Assignment",
  learn_item: "Learn item",
  workout: "Workout",
};

const PLACEHOLDERS: Record<QuickAddDestination, string> = {
  task: "Add a task…",
  meal: "What did you eat?",
  assignment: "Assignment title…",
  learn_item: "Something to learn…",
  workout: "What workout?",
};

const initialManualState: QuickAddState = { error: null };
const initialAiState: AiQuickAddState = { error: null, summary: null };

export function QuickAddBar({
  courses,
}: {
  courses: { id: string; name: string }[];
}) {
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  const [manualState, manualFormAction, manualPending] = useActionState(
    quickAddAction,
    initialManualState
  );
  const [aiState, aiFormAction, aiPending] = useActionState(
    aiQuickAddAction,
    initialAiState
  );

  const [destination, setDestination] = useState<QuickAddDestination>("task");
  const manualFormRef = useRef<HTMLFormElement>(null);
  const aiFormRef = useRef<HTMLFormElement>(null);
  const wasManualPending = useRef(false);
  const wasAiPending = useRef(false);

  useEffect(() => {
    if (wasManualPending.current && !manualPending && !manualState.error) {
      manualFormRef.current?.reset();
    }
    wasManualPending.current = manualPending;
  }, [manualPending, manualState.error]);

  useEffect(() => {
    if (wasAiPending.current && !aiPending && !aiState.error) {
      aiFormRef.current?.reset();
    }
    wasAiPending.current = aiPending;
  }, [aiPending, aiState.error]);

  const needsCourse = destination === "assignment";

  return (
    <div className="border-t border-slate-200 bg-white px-3 py-2">
      <div className="mb-2 flex gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`rounded-full px-2.5 py-1 ${
            mode === "ai" ? "bg-brand-600 text-white" : "text-slate-500"
          }`}
        >
          AI
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-full px-2.5 py-1 ${
            mode === "manual" ? "bg-brand-600 text-white" : "text-slate-500"
          }`}
        >
          Manual
        </button>
      </div>

      {mode === "ai" ? (
        <form ref={aiFormRef} action={aiFormAction}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="text"
              required
              placeholder="Tell me anything — I'll sort it out…"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <button
              type="submit"
              disabled={aiPending}
              aria-label="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white disabled:opacity-50"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          {aiPending && (
            <p className="mt-1.5 text-xs text-slate-400">Thinking…</p>
          )}
          {!aiPending && aiState.summary && (
            <p className="mt-1.5 text-xs text-green-600">{aiState.summary}</p>
          )}
          {!aiPending && aiState.error && (
            <p className="mt-1.5 text-xs text-red-600">{aiState.error}</p>
          )}
        </form>
      ) : (
        <form ref={manualFormRef} action={manualFormAction}>
          {needsCourse && (
            <div className="mb-2">
              {courses.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Add a course in School before quick-adding assignments.
                </p>
              ) : (
                <select
                  name="courseId"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-700"
                >
                  <option value="" disabled>
                    Course…
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <select
              name="destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value as QuickAddDestination)
              }
              aria-label="Add to"
              className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-sm font-medium text-slate-700"
            >
              {(Object.keys(DESTINATION_LABELS) as QuickAddDestination[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {DESTINATION_LABELS[key]}
                  </option>
                )
              )}
            </select>

            <input
              type="text"
              name="text"
              required
              placeholder={PLACEHOLDERS[destination]}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />

            <button
              type="submit"
              disabled={manualPending || (needsCourse && courses.length === 0)}
              aria-label="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white disabled:opacity-50"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {manualState.error && (
            <p className="mt-1.5 text-xs text-red-600">{manualState.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
