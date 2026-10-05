import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabaseAnonKey, supabaseUrl } from "./env";

// Server-side Supabase client for use in Server Components, Server Actions,
// and Route Handlers. Reads/writes the auth session via cookies so RLS can
// see the signed-in user on every request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `setAll` is called from a Server Component in some cases (e.g.
          // during static rendering), where cookies cannot be written. This
          // is safe to ignore as long as middleware also refreshes the
          // session on every request.
        }
      },
    },
  });
}
