import type { TypedSupabaseClient } from "./client";
import type { Database, AssignmentStatus } from "@/lib/supabase/types";
import type { Course } from "./courses";

export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type AssignmentWithCourse = Assignment & {
  courses: Pick<Course, "id" | "name" | "code"> | null;
};
export type NewAssignment = Pick<
  Database["public"]["Tables"]["assignments"]["Insert"],
  "course_id" | "title" | "due_at" | "notes"
>;

export async function listAssignmentsWithCourse(
  supabase: TypedSupabaseClient
): Promise<AssignmentWithCourse[]> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*, courses(id, name, code)")
    .order("due_at", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data as AssignmentWithCourse[];
}

export async function listAssignmentsDueBefore(
  supabase: TypedSupabaseClient,
  beforeIso: string
): Promise<AssignmentWithCourse[]> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*, courses(id, name, code)")
    .neq("status", "done")
    .not("due_at", "is", null)
    .lte("due_at", beforeIso)
    .order("due_at", { ascending: true });

  if (error) throw error;
  return data as AssignmentWithCourse[];
}

export async function createAssignment(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewAssignment
): Promise<Assignment> {
  const { data, error } = await supabase
    .from("assignments")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateAssignmentStatus(
  supabase: TypedSupabaseClient,
  id: string,
  status: AssignmentStatus
): Promise<void> {
  const { error } = await supabase
    .from("assignments")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}
