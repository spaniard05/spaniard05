"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, requireUserAndClient } from "@/lib/auth/session";
import { organizeFreeText } from "@/lib/ai/chat-organizer";
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
  workout: ["/today", "/health"],
};

const DESTINATION_NOUN: Record<QuickAddDestination, string> = {
  meal: "meal",
  task: "task",
  assignment: "assignment",
  learn_item: "learn item",
  workout: "workout",
};

function revalidateAll(destinations: Iterable<QuickAddDestination>) {
  const paths = new Set<string>();
  for (const destination of destinations) {
    for (const path of REVALIDATE_PATHS[destination]) paths.add(path);
  }
  for (const path of paths) revalidatePath(path);
}

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
    const { supabase } = await requireUserAndClient();
    await executeQuickAdd(
      supabase,
      user.id,
      destination as QuickAddDestination,
      { text, courseId: typeof courseId === "string" ? courseId : null }
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that." };
  }

  revalidateAll([destination as QuickAddDestination]);
  return { error: null };
}

export type AiQuickAddState = { error: string | null; summary: string | null };

export async function aiQuickAddAction(
  _prevState: AiQuickAddState,
  formData: FormData
): Promise<AiQuickAddState> {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) {
    return { error: "Type something first.", summary: null };
  }

  const { user, supabase } = await requireUserAndClient();
  const items = await organizeFreeText(text);

  if (items.length === 0) {
    return {
      error: "Couldn't figure out where that goes — try the manual option, or rephrase.",
      summary: null,
    };
  }

  const created: QuickAddDestination[] = [];
  for (const item of items) {
    try {
      await executeQuickAdd(supabase, user.id, item.destination, {
        text: item.title,
      });
      created.push(item.destination);
    } catch {
      // Skip whatever failed; still report what succeeded.
    }
  }

  if (created.length === 0) {
    return { error: "Couldn't save that. Try again.", summary: null };
  }

  revalidateAll(created);

  const counts = new Map<QuickAddDestination, number>();
  for (const destination of created) {
    counts.set(destination, (counts.get(destination) ?? 0) + 1);
  }
  const summary = Array.from(counts.entries())
    .map(([destination, count]) => {
      const noun = DESTINATION_NOUN[destination];
      return `${count} ${noun}${count === 1 ? "" : "s"}`;
    })
    .join(", ");

  return { error: null, summary: `Added ${summary}.` };
}
