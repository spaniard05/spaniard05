import type { TypedSupabaseClient } from "./client";
import type { Database } from "@/lib/supabase/types";

export type Workout = Database["public"]["Tables"]["workouts"]["Row"];
export type WorkoutSet = Database["public"]["Tables"]["workout_sets"]["Row"];
export type WorkoutWithSets = Workout & { workout_sets: WorkoutSet[] };

export type NewWorkout = Pick<
  Database["public"]["Tables"]["workouts"]["Insert"],
  "date" | "title" | "notes"
>;
export type NewWorkoutSet = Pick<
  Database["public"]["Tables"]["workout_sets"]["Insert"],
  "workout_id" | "exercise" | "reps" | "weight" | "set_order"
>;

export async function listWorkoutsWithSets(
  supabase: TypedSupabaseClient,
  limit = 20
): Promise<WorkoutWithSets[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_sets(*)")
    .order("date", { ascending: false })
    .order("set_order", {
      ascending: true,
      referencedTable: "workout_sets",
    })
    .limit(limit);

  if (error) throw error;
  return data as WorkoutWithSets[];
}

export async function getWorkoutForDate(
  supabase: TypedSupabaseClient,
  date: string
): Promise<WorkoutWithSets | null> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_sets(*)")
    .eq("date", date)
    .order("set_order", {
      ascending: true,
      referencedTable: "workout_sets",
    })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as WorkoutWithSets | null;
}

export async function createWorkout(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewWorkout
): Promise<Workout> {
  const { data, error } = await supabase
    .from("workouts")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function createWorkoutSet(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewWorkoutSet
): Promise<WorkoutSet> {
  const { data, error } = await supabase
    .from("workout_sets")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
