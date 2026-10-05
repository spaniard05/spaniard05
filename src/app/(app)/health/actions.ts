"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { createMeal } from "@/lib/data/meals";
import { createWorkout, createWorkoutSet } from "@/lib/data/workouts";
import { parseOptionalNumber, parseOptionalText, requireText } from "@/lib/forms";
import { todayDateString } from "@/lib/date";
import type { FormState } from "@/components/ui/action-form";

function revalidateHealth() {
  revalidatePath("/health");
  revalidatePath("/today");
}

export async function addMealAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const description = requireText(formData.get("description"));

    await createMeal(supabase, user.id, {
      description,
      calories: parseOptionalNumber(formData.get("calories")),
      protein: parseOptionalNumber(formData.get("protein")),
      carbs: parseOptionalNumber(formData.get("carbs")),
      fat: parseOptionalNumber(formData.get("fat")),
      eaten_at: new Date().toISOString(),
    });

    revalidateHealth();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that meal." };
  }
}

export async function addWorkoutAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const title = requireText(formData.get("title"));
    const date = parseOptionalText(formData.get("date")) ?? todayDateString();

    await createWorkout(supabase, user.id, {
      title,
      date,
      notes: parseOptionalText(formData.get("notes")),
    });

    revalidateHealth();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that workout." };
  }
}

export async function addWorkoutSetAction(
  workoutId: string,
  nextOrder: number,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const { user, supabase } = await requireUserAndClient();
    const exercise = requireText(formData.get("exercise"));

    await createWorkoutSet(supabase, user.id, {
      workout_id: workoutId,
      exercise,
      reps: parseOptionalNumber(formData.get("reps")),
      weight: parseOptionalNumber(formData.get("weight")),
      set_order: nextOrder,
    });

    revalidateHealth();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't save that set." };
  }
}
