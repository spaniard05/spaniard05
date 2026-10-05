import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { anthropicApiKey } from "@/lib/env";

// A deliberate subset of QuickAddDestination: assignments need a specific
// course picked by hand (the AI could easily guess the wrong course, or
// invent one), so anything assignment-shaped gets filed as a task instead.
const ORGANIZER_DESTINATIONS = ["meal", "task", "workout", "learn_item"] as const;

const ClassifiedItemSchema = z.object({
  destination: z.enum(ORGANIZER_DESTINATIONS),
  title: z.string(),
});

const OrganizedResultSchema = z.object({
  items: z.array(ClassifiedItemSchema).max(10),
});

export type OrganizerDestination = (typeof ORGANIZER_DESTINATIONS)[number];
export type ClassifiedItem = z.infer<typeof ClassifiedItemSchema>;

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey() });
  }
  return client;
}

/**
 * Splits free-form text into one or more items, each filed under exactly
 * one bucket. Returns an empty array (never throws) on API failure so the
 * UI can show a clean "couldn't process that" message.
 */
export async function organizeFreeText(text: string): Promise<ClassifiedItem[]> {
  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      system:
        "You split a short note into one or more items and file each under " +
        "exactly one bucket: 'meal' (something eaten), 'task' (a personal " +
        "to-do, reminder, or school-related to-do), 'workout' (an exercise " +
        "or cardio session), or 'learn_item' (something to learn or a side " +
        "project idea). Keep each item's title short, in the user's own " +
        "words. Only split into multiple items when the text clearly " +
        "describes more than one distinct thing.",
      messages: [{ role: "user", content: text }],
      output_config: { format: zodOutputFormat(OrganizedResultSchema) },
    });

    return response.parsed_output?.items ?? [];
  } catch {
    return [];
  }
}
