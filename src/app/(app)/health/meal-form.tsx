"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addMealAction } from "./actions";

export function MealForm() {
  return (
    <ActionForm action={addMealAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <input
            type="text"
            name="description"
            required
            placeholder="What did you eat?"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              name="calories"
              placeholder="kcal"
              min={0}
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
            />
            <input
              type="number"
              name="protein"
              placeholder="protein g"
              min={0}
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
            />
            <input
              type="number"
              name="carbs"
              placeholder="carbs g"
              min={0}
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
            />
            <input
              type="number"
              name="fat"
              placeholder="fat g"
              min={0}
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Log meal"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
