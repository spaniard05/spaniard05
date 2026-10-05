import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { anthropicApiKey } from "@/lib/env";

const MacroEstimateSchema = z.object({
  calories: z.number().int().min(0).max(5000),
  protein: z.number().min(0).max(500),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(500),
});

export type MacroEstimate = z.infer<typeof MacroEstimateSchema>;

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: anthropicApiKey() });
  }
  return client;
}

/**
 * Estimates calories/protein/carbs/fat for a free-text meal description.
 * Best-effort: a single typical serving is assumed unless the description
 * says otherwise. Returns null (never throws) on any API failure so a meal
 * save never gets blocked on this — the user can still fill in macros by
 * hand later.
 */
export async function estimateMealMacros(
  description: string
): Promise<MacroEstimate | null> {
  try {
    const response = await getClient().messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      system:
        "You estimate nutrition facts for a single meal from a short, " +
        "possibly casual description. Assume one typical serving unless " +
        "the description gives a quantity. Give your best reasonable " +
        "estimate even for vague descriptions — never refuse.",
      messages: [{ role: "user", content: description }],
      output_config: {
        format: zodOutputFormat(MacroEstimateSchema),
      },
    });

    return response.parsed_output;
  } catch {
    return null;
  }
}
