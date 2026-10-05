import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { anthropicApiKey } from "@/lib/env";

export interface BriefContext {
  assignmentsDueSoon: { title: string; course: string | null; due: string | null }[];
  tasksDueOrOverdue: { title: string; due: string | null }[];
  todaysWorkout: { title: string; setCount: number } | null;
  mealsLoggedToday: number;
}

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey() });
  }
  return client;
}

/**
 * Generates a short, friendly daily brief: what's on deck today and one or
 * two concrete suggestions on how to tackle it. Returns null (never throws)
 * on API failure so Today still renders fine without it.
 */
export async function generateDailyBrief(
  context: BriefContext
): Promise<string | null> {
  try {
    const response = await getClient().messages.create({
      model: "claude-opus-5-5",
      max_tokens: 500,
      system:
        "You write a short daily brief for a personal assistant app's Today " +
        "screen, from the data given. 3-5 short lines max, plain sentences " +
        "(no markdown headers). Call out what's most urgent, then give one " +
        "or two concrete, specific suggestions on how to approach the day " +
        "— not generic advice. If there's genuinely nothing going on, say " +
        "so briefly and warmly rather than padding it out.",
      messages: [
        { role: "user", content: JSON.stringify(context) },
      ],
    });

    const text = response.content.find((b) => b.type === "text");
    return text?.text.trim() || null;
  } catch {
    return null;
  }
}
