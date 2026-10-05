import { createClient } from "@/lib/supabase/server";
import { listAssignmentsDueBefore } from "@/lib/data/assignments";
import { listOpenTasksDueBefore } from "@/lib/data/tasks";
import { getWorkoutForDate } from "@/lib/data/workouts";
import { listMealsBetween } from "@/lib/data/meals";
import {
  daysFromNowIso,
  endOfTodayIso,
  formatDueDate,
  isOverdue,
  startOfTodayIso,
  todayDateString,
} from "@/lib/date";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";

export default async function TodayPage() {
  const supabase = await createClient();
  const [assignments, tasks, workout, meals] = await Promise.all([
    listAssignmentsDueBefore(supabase, daysFromNowIso(7)),
    listOpenTasksDueBefore(supabase, endOfTodayIso()),
    getWorkoutForDate(supabase, todayDateString()),
    listMealsBetween(supabase, startOfTodayIso(), endOfTodayIso()),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Today</h1>

      <Section title="Assignments due soon">
        {assignments.length === 0 ? (
          <EmptyState>Nothing due in the next 7 days.</EmptyState>
        ) : (
          <ul className="space-y-1.5">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {assignment.courses?.name}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs ${
                    isOverdue(assignment.due_at) ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  {formatDueDate(assignment.due_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Tasks due today or overdue">
        {tasks.length === 0 ? (
          <EmptyState>Nothing due today. Nice.</EmptyState>
        ) : (
          <ul className="space-y-1.5">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="truncate font-medium text-slate-900">
                  {task.title}
                </p>
                <span
                  className={`shrink-0 text-xs ${
                    isOverdue(task.due_at) ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  {formatDueDate(task.due_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Today's workout">
        {!workout ? (
          <EmptyState>No workout logged for today yet.</EmptyState>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-medium text-slate-900">{workout.title}</p>
            {workout.workout_sets.length > 0 && (
              <ul className="mt-1.5 divide-y divide-slate-100 text-sm">
                {workout.workout_sets.map((set) => (
                  <li key={set.id} className="flex justify-between py-1 text-slate-600">
                    <span>{set.exercise}</span>
                    <span className="text-slate-400">
                      {[
                        set.reps != null ? `${set.reps} reps` : null,
                        set.weight != null ? `${set.weight} lb` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Section>

      <Section title="Meals logged so far">
        {meals.length === 0 ? (
          <EmptyState>No meals logged today yet.</EmptyState>
        ) : (
          <ul className="space-y-1.5">
            {meals.map((meal) => (
              <li
                key={meal.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="truncate font-medium text-slate-900">
                  {meal.description}
                </p>
                {meal.calories != null && (
                  <span className="shrink-0 text-xs text-slate-400">
                    {meal.calories} kcal
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
