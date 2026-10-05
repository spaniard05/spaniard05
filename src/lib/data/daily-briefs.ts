import type { TypedSupabaseClient } from "./client";
import type { Database } from "@/lib/supabase/types";

export type DailyBrief = Database["public"]["Tables"]["daily_briefs"]["Row"];

export async function getBriefForDate(
  supabase: TypedSupabaseClient,
  date: string
): Promise<DailyBrief | null> {
  const { data, error } = await supabase
    .from("daily_briefs")
    .select("*")
    .eq("brief_date", date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveBriefForDate(
  supabase: TypedSupabaseClient,
  userId: string,
  date: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from("daily_briefs")
    .upsert(
      { user_id: userId, brief_date: date, content },
      { onConflict: "user_id,brief_date" }
    );

  if (error) throw error;
}
