"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { createTask, updateTaskStatus } from "@/lib/data/tasks";
import { parseOptionalIso, parseOptionalText, requireText } from "@/lib/forms";
import type { TaskPriority, TaskStatus } from "@/lib/supabase/types";
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

export async function addTaskAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const title = requireText(formData.get("title"));

    await createTask(supabase, user.id, {
      title,
      due_at: parseOptionalIso(formData.get("dueAt")),
      priority: parsePriority(formData.get("priority")),
      recurring: parseOptionalText(formData.get("recurring")),
    });

    revalidateTasks();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that task." };
  }
}

export async function setTaskStatus(id: string, status: TaskStatus) {
  const { supabase } = await requireUserAndClient();
  await updateTaskStatus(supabase, id, status);
  revalidateTasks();
}
