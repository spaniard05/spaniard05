"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addCourseAction } from "./actions";

export function CourseForm() {
  return (
    <ActionForm action={addCourseAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <input
            type="text"
            name="name"
            required
            placeholder="Course name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="code"
              placeholder="Code (optional)"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
            <input
              type="text"
              name="semester"
              placeholder="Semester (optional)"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Add course"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
