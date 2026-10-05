import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { anthropicApiKey } from "@/lib/env";
import type { WorkoutWithSets } from "@/lib/data/workouts";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey() });
  }
  return client;
}

function summarizeRecentWorkouts(workouts: WorkoutWithSets[]): string {
  if (workouts.length === 0) return "No workout history logged yet.";

  return workouts
    .map((w) => {
      const sets = w.workout_sets
        .map((s) => {
          const parts = [s.exercise];
          if (s.weight != null) parts.push(`${s.weight} lb`);
          if (s.reps != null) parts.push(`${s.reps} reps`);
          if (s.notes) parts.push(`(${s.notes})`);
          return parts.join(" ");
        })
        .join("; ");
      return `${w.date} — ${w.title}: ${sets || "no sets logged"}`;
    })
    .join("\n");
}

/**
 * Answers a question about training (e.g. "what weight for bench today?")
 * grounded in the user's recent logged sets. Returns null (never throws)
 * on API failure.
 */
export async function askWorkoutCoach(
  recentWorkouts: WorkoutWithSets[],
  history: ChatTurn[],
  message: string
): Promise<string | null> {
  try {
    const response = await getClient().messages.create({
      model: "claude-opus-5-5",
      max_tokens: 600,
      system:
        "You are a knowledgeable, encouraging strength and conditioning " +
        "coach embedded in the user's workout log app. You're given their " +
        "recent logged sets (date, exercise, weight, reps, notes). Use it " +
        "to give specific, concrete recommendations — a weight and rep " +
        "target, not vague advice — based on their recent progression, " +
        "drop sets, and any notes (form cues, how a set felt). If an " +
        "exercise has no history, say so and suggest a reasonable starting " +
        "point. Keep answers short — a few sentences, conversational, like " +
        "a text from a coach, not an essay.\n\n" +
        "Recent workout history:\n" +
        summarizeRecentWorkouts(recentWorkouts),
      messages: [
        ...history.map((turn) => ({
          role: turn.role,
          content: turn.content,
        })),
        { role: "user" as const, content: message },
      ],
    });

    const text = response.content.find((b) => b.type === "text");
    return text?.text.trim() || null;
  } catch {
    return null;
  }
}
