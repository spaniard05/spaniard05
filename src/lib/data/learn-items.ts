import type { TypedSupabaseClient } from "./client";
import type { Database, LearnStatus } from "@/lib/supabase/types";

export type LearnItem = Database["public"]["Tables"]["learn_items"]["Row"];
export type NewLearnItem = Pick<
  Database["public"]["Tables"]["learn_items"]["Insert"],
  "title" | "resource_url" | "notes"
>;

export async function listLearnItems(
  supabase: TypedSupabaseClient
): Promise<LearnItem[]> {
  const { data, error } = await supabase
    .from("learn_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createLearnItem(
  supabase: TypedSupabaseClient,
  userId: string,
  input: NewLearnItem
): Promise<LearnItem> {
  const { data, error } = await supabase
    .from("learn_items")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateLearnItemStatus(
  supabase: TypedSupabaseClient,
  id: string,
  status: LearnStatus
): Promise<void> {
  const { error } = await supabase
    .from("learn_items")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}
