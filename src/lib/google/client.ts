import "server-only";
import type { TypedSupabaseClient } from "@/lib/data/client";
import {
  getGoogleCalendarConnection,
  updateGoogleCalendarTokens,
} from "@/lib/data/google-calendar";
import { refreshAccessToken } from "./oauth";

const EXPIRY_SAFETY_MARGIN_MS = 60_000;

/**
 * Returns a valid Google access token for the signed-in user, refreshing it
 * first if it's expired (or about to). Returns null if the user hasn't
 * connected Google Calendar — callers should silently skip sync in that case.
 */
export async function getValidGoogleAccessToken(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<{ accessToken: string; calendarId: string } | null> {
  const connection = await getGoogleCalendarConnection(supabase);
  if (!connection) return null;

  const expiresAt = new Date(connection.token_expires_at).getTime();
  if (expiresAt - EXPIRY_SAFETY_MARGIN_MS > Date.now()) {
    return {
      accessToken: connection.access_token,
      calendarId: connection.calendar_id,
    };
  }

  const refreshed = await refreshAccessToken(connection.refresh_token);
  const tokenExpiresAt = new Date(
    Date.now() + refreshed.expires_in * 1000
  ).toISOString();

  await updateGoogleCalendarTokens(supabase, userId, {
    access_token: refreshed.access_token,
    token_expires_at: tokenExpiresAt,
  });

  return {
    accessToken: refreshed.access_token,
    calendarId: connection.calendar_id,
  };
}
