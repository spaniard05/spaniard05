import type { Meal } from "@/lib/data/meals";
import { EmptyState } from "@/components/ui/empty-state";

export function MealList({ meals }: { meals: Meal[] }) {
  if (meals.length === 0) {
    return <EmptyState>No meals logged yet.</EmptyState>;
  }

  return (
    <ul className="space-y-2">
      {meals.map((meal) => (
        <li
          key={meal.id}
          className="rounded-xl border border-slate-200 bg-white p-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-medium text-slate-900">{meal.description}</p>
            <time className="shrink-0 text-xs text-slate-400">
              {new Date(meal.eaten_at).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </time>
          </div>
          {(meal.calories != null ||
            meal.protein != null ||
            meal.carbs != null ||
            meal.fat != null) && (
            <p className="mt-0.5 text-xs text-slate-400">
              {[
                meal.calories != null ? `${meal.calories} kcal` : null,
                meal.protein != null ? `${meal.protein}g protein` : null,
                meal.carbs != null ? `${meal.carbs}g carbs` : null,
                meal.fat != null ? `${meal.fat}g fat` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
