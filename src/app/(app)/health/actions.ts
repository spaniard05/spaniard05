"use server";

import { revalidatePath } from "next/cache";
import { requireUserAndClient } from "@/lib/auth/session";
import { createMeal } from "@/lib/data/meals";
import {
  createWorkout,
  createWorkoutSet,
  listWorkoutsWithSets,
} from "@/lib/data/workouts";
import { parseOptionalNumber, parseOptionalText, requireText } from "@/lib/forms";
import { todayDateString } from "@/lib/date";
import { estimateMealMacros } from "@/lib/ai/macros";
import { askWorkoutCoach, type ChatTurn } from "@/lib/ai/workout-coach";
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

    let calories = parseOptionalNumber(formData.get("calories"));
    let protein = parseOptionalNumber(formData.get("protein"));
    let carbs = parseOptionalNumber(formData.get("carbs"));
    let fat = parseOptionalNumber(formData.get("fat"));
    let macrosEstimated = false;

    // If every macro field was left blank, estimate them from the
    // description so manual entry stays optional. Any one field filled in
    // is treated as "I'll do this one by hand" and skips estimation.
    if (
      calories == null &&
      protein == null &&
      carbs == null &&
      fat == null
    ) {
      const estimate = await estimateMealMacros(description);
      if (estimate) {
        calories = estimate.calories;
        protein = estimate.protein;
        carbs = estimate.carbs;
        fat = estimate.fat;
        macrosEstimated = true;
      }
    }

    await createMeal(supabase, user.id, {
      description,
      calories,
      protein,
      carbs,
      fat,
      macros_estimated: macrosEstimated,
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

export async function askWorkoutCoachAction(
  history: ChatTurn[],
  message: string
): Promise<string> {
  const { supabase } = await requireUserAndClient();
  const recentWorkouts = await listWorkoutsWithSets(supabase, 5);
  const reply = await askWorkoutCoach(recentWorkouts, history, message);
  return reply ?? "Couldn't reach the coach just now — try again in a bit.";
}
