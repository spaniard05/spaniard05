import type { TypedSupabaseClient } from "./client";
import type { Database, TaskStatus } from "@/lib/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type NewTask = Pick<
  Database["public"]["Tables"]["tasks"]["Insert"],
  "title" | "due_at" | "priority" | "recurring" | "notes"
>;

const PRIORITY_RANK: Record<Task["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aDue = a.due_at ? Date.parse(a.due_at) : Infinity;
    const bDue = b.due_at ? Date.parse(b.due_at) : Infinity;
    if (aDue !== bDue) return aDue - bDue;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });
}

export async function listTasks(
  supabase: TypedSupabaseClient
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .is("archived_at", null);

  if (error) throw error;
  return sortTasks(data);
}

export async function listArchivedTasks(
  supabase: TypedSupabaseClient
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function listOpenTasksDueBefore(
  supabase: TypedSupabaseClient,
  beforeIso: string
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .neq("status", "done")
    .is("archived_at", null)
    .not("due_at", "is", null)
    .lte("due_at", beforeIso);

  if (error) throw error;
  return sortTasks(data);
}

export async function createTask(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewTask
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskStatus(
  supabase: TypedSupabaseClient,
  id: string,
  status: TaskStatus
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function setTaskArchived(
  supabase: TypedSupabaseClient,
  id: string,
  archived: boolean
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/** Deletes a task and returns the row that was deleted (null if it was already gone). */
export async function deleteTask(
  supabase: TypedSupabaseClient,
  id: string
): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function setTaskGoogleEventId(
  supabase: TypedSupabaseClient,
  id: string,
  googleEventId: string | null
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ google_event_id: googleEventId })
    .eq("id", id);

  if (error) throw error;
}

export interface ImportedGoogleTask {
  title: string;
  due_at: string | null;
  notes: string | null;
  google_task_id: string;
}

/**
 * Inserts one task imported from Google Tasks, skipping it if this exact
 * Google task was already imported before (safe to re-run).
 */
export async function importGoogleTask(
  supabase: TypedSupabaseClient,
  userId: string,
  input: ImportedGoogleTask
): Promise<boolean> {
  const { data, error } = await supabase
    .from("tasks")
    .upsert(
      { ...input, user_id: userId, priority: "medium" },
      { onConflict: "user_id,google_task_id", ignoreDuplicates: true }
    )
    .select("id");

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
