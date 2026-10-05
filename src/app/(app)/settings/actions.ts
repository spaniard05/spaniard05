"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { deleteGoogleCalendarConnection } from "@/lib/data/google-calendar";
import { importGoogleTask } from "@/lib/data/tasks";
import { getValidGoogleAccessToken } from "@/lib/google/client";
import { listGoogleTaskLists, listGoogleTasks } from "@/lib/google/tasks";

export async function disconnectGoogleCalendar() {
  const { user, supabase } = await requireUserAndClient();
  await deleteGoogleCalendarConnection(supabase, user.id);
  revalidatePath("/settings");
}

async function runGoogleTasksImport(): Promise<
  { ok: true; imported: number } | { ok: false }
> {
  const { user, supabase } = await requireUserAndClient();

  try {
    const conn = await getValidGoogleAccessToken(supabase, user.id);
    if (!conn) return { ok: false };

    const lists = await listGoogleTaskLists(conn.accessToken);
    let imported = 0;

    for (const list of lists) {
      const tasks = await listGoogleTasks(conn.accessToken, list.id);
      for (const task of tasks) {
        const created = await importGoogleTask(supabase, user.id, {
          title: task.title?.trim() || "(untitled)",
          due_at: task.due ?? null,
          notes: task.notes ?? null,
          google_task_id: task.id,
        });
        if (created) imported += 1;
      }
    }

    revalidatePath("/tasks");
    revalidatePath("/today");
    return { ok: true, imported };
  } catch {
    return { ok: false };
  }
}

export async function importGoogleTasks() {
  const result = await runGoogleTasksImport();
  if (result.ok) {
    redirect(`/settings?tasksImported=${result.imported}`);
  } else {
    redirect("/settings?tasksImportError=1");
  }
}
