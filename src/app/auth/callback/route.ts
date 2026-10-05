import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Completes the Supabase magic-link sign-in: exchanges the one-time code
// in the URL for a session, then redirects into the app.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/today";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  const signInUrl = new URL("/sign-in", origin);
  signInUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(signInUrl);
}
