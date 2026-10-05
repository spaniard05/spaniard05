import type { WorkoutWithSets } from "@/lib/data/workouts";
import { WorkoutSetForm } from "./workout-set-form";

export function WorkoutCard({ workout }: { workout: WorkoutWithSets }) {
  const sets = workout.workout_sets;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium text-slate-900">{workout.title}</h3>
        <time className="text-xs text-slate-400">
          {new Date(workout.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      {workout.notes && (
        <p className="mt-0.5 text-sm text-slate-500">{workout.notes}</p>
      )}

      {sets.length > 0 && (
        <ul className="mt-2 divide-y divide-slate-100 text-sm">
          {sets.map((set) => (
            <li key={set.id} className="py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">{set.exercise}</span>
                <span className="text-slate-400">
                  {[
                    set.reps != null ? `${set.reps} reps` : null,
                    set.weight != null ? `${set.weight} lb` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {set.notes && (
                <p className="text-xs text-slate-400">{set.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <WorkoutSetForm workoutId={workout.id} nextOrder={sets.length} />
    </div>
  );
}
