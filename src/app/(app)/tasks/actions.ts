"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import {
  createTask,
  deleteTask,
  setTaskArchived,
  updateTaskStatus,
} from "@/lib/data/tasks";
import { parseOptionalIso, parseOptionalText, requireText } from "@/lib/forms";
import { removeCalendarEvent, syncTaskToCalendar } from "@/lib/google/sync";
import type { TaskList, TaskPriority, TaskStatus } from "@/lib/supabase/types";
import type { FormState } from "@/components/ui/action-form";

function revalidateTasks() {
  revalidatePath("/tasks");
  revalidatePath("/today");
}

function parsePriority(value: FormDataEntryValue | null): TaskPriority {
  return value === "low" || value === "medium" || value === "high"
    ? value
    : "medium";
}

function parseList(value: FormDataEntryValue | null): TaskList {
  return value === "groceries" || value === "shopping" ? value : "tasks";
}

export async function addTaskAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const title = requireText(formData.get("title"));
    const list = parseList(formData.get("list"));

    const task = await createTask(supabase, user.id, {
      title,
      list,
      due_at: parseOptionalIso(formData.get("dueAt")),
      priority: parsePriority(formData.get("priority")),
      recurring: parseOptionalText(formData.get("recurring")),
      notes: parseOptionalText(formData.get("notes")),
    });
    await syncTaskToCalendar(supabase, user.id, task);

    revalidateTasks();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that task." };
  }
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  const { user, supabase } = await requireUserAndClient();
  const task = await updateTaskStatus(supabase, id, status);
  await syncTaskToCalendar(supabase, user.id, task);
  revalidateTasks();
}

export async function setTaskArchivedAction(id: string, archived: boolean) {
  const { user, supabase } = await requireUserAndClient();
  const task = await setTaskArchived(supabase, id, archived);
  // Hidden tasks shouldn't keep a calendar entry; unhiding recreates one if due.
  await syncTaskToCalendar(supabase, user.id, task);
  revalidateTasks();
}

export async function deleteTaskAction(id: string) {
  const { user, supabase } = await requireUserAndClient();
  const deleted = await deleteTask(supabase, id);
  if (deleted?.google_event_id) {
    await removeCalendarEvent(supabase, user.id, deleted.google_event_id);
  }
  revalidateTasks();
}
