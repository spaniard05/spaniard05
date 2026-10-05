import type { TypedSupabaseClient } from "./client";
import type { Database } from "@/lib/supabase/types";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type NewCourse = Pick<
  Database["public"]["Tables"]["courses"]["Insert"],
  "name" | "code" | "semester"
>;

export async function listCourses(
  supabase: TypedSupabaseClient
): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createCourse(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewCourse
): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
