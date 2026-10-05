"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addLearnItemAction } from "./actions";

export function LearnItemForm() {
  return (
    <ActionForm action={addLearnItemAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            required
            placeholder="Something to learn…"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <input
            type="url"
            name="resourceUrl"
            placeholder="Link (optional)"
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
            {pending ? "Saving…" : "Add item"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
