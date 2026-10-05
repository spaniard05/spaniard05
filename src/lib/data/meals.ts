import type { TypedSupabaseClient } from "./client";
import type { Database } from "@/lib/supabase/types";

export type Meal = Database["public"]["Tables"]["meals"]["Row"];
export type NewMeal = Pick<
  Database["public"]["Tables"]["meals"]["Insert"],
  "description" | "calories" | "protein" | "carbs" | "fat" | "eaten_at"
>;

export async function listMealsBetween(
  supabase: TypedSupabaseClient,
  startIso: string,
  endIso: string
): Promise<Meal[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .gte("eaten_at", startIso)
    .lt("eaten_at", endIso)
    .order("eaten_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function listRecentMeals(
  supabase: TypedSupabaseClient,
  limit = 20
): Promise<Meal[]> {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .order("eaten_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function createMeal(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewMeal
): Promise<Meal> {
  const { data, error } = await supabase
    .from("meals")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
