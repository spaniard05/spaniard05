"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addAssignmentAction } from "./actions";
import type { Course } from "@/lib/data/courses";

export function AssignmentForm({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
        Add a course first to start tracking assignments.
      </p>
    );
  }

  return (
    <ActionForm action={addAssignmentAction} className="rounded-xl border border-slate-200 bg-white p-3">
      {({ pending }) => (
        <div className="space-y-2">
          <select
            name="courseId"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-base text-slate-900"
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
          <input
            type="text"
            name="title"
            required
            placeholder="Assignment title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <input
            type="datetime-local"
            name="dueAt"
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
            {pending ? "Saving…" : "Add assignment"}
          </button>
        </div>
      )}
    </ActionForm>
  );
}
