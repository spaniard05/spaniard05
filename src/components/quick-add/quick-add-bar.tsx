"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { quickAddAction, type QuickAddState } from "@/lib/quick-add/action";
import type { QuickAddDestination } from "@/lib/quick-add/router";
import { PlusIcon } from "@/components/nav/icons";

const DESTINATION_LABELS: Record<QuickAddDestination, string> = {
  task: "Task",
  meal: "Meal",
  assignment: "Assignment",
  learn_item: "Learn item",
};

const PLACEHOLDERS: Record<QuickAddDestination, string> = {
  task: "Add a task…",
  meal: "What did you eat?",
  assignment: "Assignment title…",
  learn_item: "Something to learn…",
};

const initialState: QuickAddState = { error: null };

export function QuickAddBar({
  courses,
}: {
  courses: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    quickAddAction,
    initialState
  );
  const [destination, setDestination] = useState<QuickAddDestination>("task");
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state.error]);

  const needsCourse = destination === "assignment";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-t border-slate-200 bg-white px-3 py-2"
    >
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
          disabled={isPending || (needsCourse && courses.length === 0)}
          aria-label="Add"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white disabled:opacity-50"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {state.error && (
        <p className="mt-1.5 text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
