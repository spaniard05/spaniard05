"use client";

import { ActionForm } from "@/components/ui/action-form";
import { addWorkoutSetAction } from "./actions";

export function WorkoutSetForm({
  workoutId,
  nextOrder,
}: {
  workoutId: string;
  nextOrder: number;
}) {
  const action = addWorkoutSetAction.bind(null, workoutId, nextOrder);

  return (
    <ActionForm action={action} className="mt-2">
      {({ pending }) => (
        <div className="flex gap-1.5">
          <input
            type="text"
            name="exercise"
            required
            placeholder="Exercise"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
          />
          <input
            type="number"
            name="reps"
            placeholder="reps"
            min={0}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
          />
          <input
            type="number"
            name="weight"
            placeholder="lbs"
            min={0}
            step="0.5"
            className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            Add
          </button>
        </div>
      )}
    </ActionForm>
  );
}
