import type { TypedSupabaseClient } from "@/lib/data/client";
import { createMeal } from "@/lib/data/meals";
import { createTask } from "@/lib/data/tasks";
import { createAssignment } from "@/lib/data/assignments";
import { createLearnItem } from "@/lib/data/learn-items";
import { createWorkout } from "@/lib/data/workouts";
import { todayDateString } from "@/lib/date";

export const QUICK_ADD_DESTINATIONS = [
  "meal",
  "task",
  "assignment",
  "learn_item",
  "workout",
] as const;

export type QuickAddDestination = (typeof QUICK_ADD_DESTINATIONS)[number];

export interface QuickAddContext {
  text: string;
  courseId?: string | null;
}

/**
 * Turns one quick-add entry into a row in the right table.
 *
 * The destination is a plain argument today because the UI's manual picker
 * decides it. A later AI-router phase can infer `destination` (and richer
 * fields) from `context.text` with a classifier, then call this exact same
 * function — nothing downstream of "destination decided" needs to change.
 */
export async function executeQuickAdd(
  supabase: TypedSupabaseClient,
  userId: string,
  destination: QuickAddDestination,
  context: QuickAddContext
) {
  const text = context.text.trim();
  if (!text) {
    throw new Error("Quick-add text is required");
  }

  switch (destination) {
    case "meal":
      return createMeal(supabase, userId, {
        description: text,
        eaten_at: new Date().toISOString(),
      });
    case "task":
      return createTask(supabase, userId, {
        title: text,
        priority: "medium",
      });
    case "assignment": {
      if (!context.courseId) {
        throw new Error("Pick a course for this assignment");
      }
      return createAssignment(supabase, userId, {
        course_id: context.courseId,
        title: text,
      });
    }
    case "learn_item":
      return createLearnItem(supabase, userId, { title: text });
    case "workout":
      return createWorkout(supabase, userId, {
        title: text,
        date: todayDateString(),
      });
  }
}
