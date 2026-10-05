import { createClient } from "@/lib/supabase/server";
import { listRecentMeals } from "@/lib/data/meals";
import { listWorkoutsWithSets } from "@/lib/data/workouts";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { MealForm } from "./meal-form";
import { MealList } from "./meal-list";
import { WorkoutForm } from "./workout-form";
import { WorkoutCard } from "./workout-card";

export default async function HealthPage() {
  const supabase = await createClient();
  const [meals, workouts] = await Promise.all([
    listRecentMeals(supabase),
    listWorkoutsWithSets(supabase),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Health</h1>

      <Section title="Log a meal">
        <MealForm />
      </Section>

      <Section title="Recent meals">
        <MealList meals={meals} />
      </Section>

      <Section title="Log a workout">
        <WorkoutForm />
      </Section>

      <Section title="Recent workouts">
        {workouts.length === 0 ? (
          <EmptyState>No workouts logged yet.</EmptyState>
        ) : (
          <div className="space-y-2">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
