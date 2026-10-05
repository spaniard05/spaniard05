import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { exchangeCodeForTokens } from "@/lib/google/oauth";
import { upsertGoogleCalendarConnection } from "@/lib/data/google-calendar";
import { GOOGLE_OAUTH_STATE_COOKIE } from "@/lib/google/state-cookie";

function redirectToSettings(origin: string, param: "googleConnected" | "googleError") {
  const url = new URL("/settings", origin);
  url.searchParams.set(param, "1");
  const response = NextResponse.redirect(url);
  response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expectedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToSettings(origin, "googleError");
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens.refresh_token) {
      return redirectToSettings(origin, "googleError");
    }

    const supabase = await createClient();
    await upsertGoogleCalendarConnection(supabase, user.id, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString(),
    });

    return redirectToSettings(origin, "googleConnected");
  } catch {
    return redirectToSettings(origin, "googleError");
  }
}
