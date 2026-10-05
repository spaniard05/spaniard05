"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  executeQuickAdd,
  QUICK_ADD_DESTINATIONS,
  type QuickAddDestination,
} from "./router";

const REVALIDATE_PATHS: Record<QuickAddDestination, string[]> = {
  meal: ["/today", "/health"],
  task: ["/today", "/tasks"],
  assignment: ["/today", "/school"],
  learn_item: ["/learn"],
};

export type QuickAddState = { error: string | null };

export async function quickAddAction(
  _prevState: QuickAddState,
  formData: FormData
): Promise<QuickAddState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You need to sign in again." };
  }

  const destination = formData.get("destination");
  if (
    typeof destination !== "string" ||
    !QUICK_ADD_DESTINATIONS.includes(destination as QuickAddDestination)
  ) {
    return { error: "Pick where this goes." };
  }

  const text = String(formData.get("text") ?? "").trim();
  if (!text) {
    return { error: "Type something first." };
  }

  const courseId = formData.get("courseId");

  try {
    const supabase = await createClient();
    await executeQuickAdd(
      supabase,
      user.id,
      destination as QuickAddDestination,
      { text, courseId: typeof courseId === "string" ? courseId : null }
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that." };
  }

  for (const path of REVALIDATE_PATHS[destination as QuickAddDestination]) {
    revalidatePath(path);
  }

  return { error: null };
}
