"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addTaskAction } from "./actions";

export function TaskForm() {
  return (
    <ActionForm action={addTaskAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            required
            placeholder="Add a task…"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="dueAt"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
            />
            <select
              name="priority"
              defaultValue="medium"
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-700"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <input
            type="text"
            name="recurring"
            placeholder="Recurring (optional, e.g. weekly)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          />
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
            {pending ? "Saving…" : "Add task"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
