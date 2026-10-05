"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addWorkoutAction } from "./actions";
import { todayDateString } from "@/lib/date";

export function WorkoutForm() {
  return (
    <ActionForm action={addWorkoutAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              required
              placeholder="Workout title (e.g. Push day)"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <input
              type="date"
              name="date"
              defaultValue={todayDateString()}
              className="rounded-lg border border-slate-200 px-2 py-2.5 text-sm text-slate-900"
            />
          </div>
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Log workout"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
