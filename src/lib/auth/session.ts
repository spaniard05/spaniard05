import { createClient } from "@/lib/supabase/server";

// Resolves the signed-in user for server-side data access. Middleware
// already guarantees every non-public route has a session, so this should
// only ever return null for public routes or edge cases (expired session
// mid-request); callers should treat null as "not authorized".
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Convenience for server actions: a signed-in user plus a ready client, or
// a thrown error if the session has gone away mid-action.
export async function requireUserAndClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You need to sign in again.");
  }
  return { user, supabase };
}
