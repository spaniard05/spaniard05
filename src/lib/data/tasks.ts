import type { TypedSupabaseClient } from "./client";
import type { Database, TaskStatus } from "@/lib/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type NewTask = Pick<
  Database["public"]["Tables"]["tasks"]["Insert"],
  "title" | "due_at" | "priority" | "recurring"
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
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) throw error;
  return sortTasks(data);
}

export async function listOpenTasksDueBefore(
  supabase: TypedSupabaseClient,
  beforeIso: string
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .neq("status", "done")
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
