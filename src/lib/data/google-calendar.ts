import type { TypedSupabaseClient } from "./client";
import type { Database } from "@/lib/supabase/types";

export type GoogleCalendarConnection =
  Database["public"]["Tables"]["google_calendar_connections"]["Row"];

export async function getGoogleCalendarConnection(
  supabase: TypedSupabaseClient
): Promise<GoogleCalendarConnection | null> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertGoogleCalendarConnection(
  supabase: TypedSupabaseClient,
  userId: string,
  input: {
    access_token: string;
    refresh_token: string;
    token_expires_at: string;
  }
): Promise<GoogleCalendarConnection> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .upsert({ ...input, user_id: userId }, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoogleCalendarTokens(
  supabase: TypedSupabaseClient,
  userId: string,
  input: { access_token: string; token_expires_at: string }
): Promise<void> {
  const { error } = await supabase
    .from("google_calendar_connections")
    .update(input)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteGoogleCalendarConnection(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("google_calendar_connections")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}
