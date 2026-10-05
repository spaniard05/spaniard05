"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addTaskAction } from "./actions";
import type { TaskList } from "@/lib/supabase/types";

export function SimpleListForm({
  list,
  placeholder,
}: {
  list: TaskList;
  placeholder: string;
}) {
  return (
    <ActionForm
      action={addTaskAction}
      className="flex gap-2 rounded-xl border border-slate-200 bg-white p-3"
    >
      {({ pending }) => (
        <>
          <input type="hidden" name="list" value={list} />
          <input
            type="text"
            name="title"
            required
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </>
      )}
    </ActionForm>
  );
}
